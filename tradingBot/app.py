import os
import sys
import json
import time
import random
import logging
import urllib.request
import urllib.parse
from flask import Flask, render_template, jsonify, request

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("TradingBot")

app = Flask(
    __name__,
    template_folder="templates",
    static_folder="static",
    static_url_path="/static"
)

# In-memory storage for webhooks and alerts
webhook_urls = []
alert_logs = []

# List of default popular symbols
POPULAR_SYMBOLS = [
    {"symbol": "BINANCE:BTCUSDT", "name": "Bitcoin / TetherUS", "type": "crypto"},
    {"symbol": "BINANCE:ETHUSDT", "name": "Ethereum / TetherUS", "type": "crypto"},
    {"symbol": "BINANCE:SOLUSDT", "name": "Solana / TetherUS", "type": "crypto"},
    {"symbol": "NASDAQ:AAPL", "name": "Apple Inc.", "type": "stock"},
    {"symbol": "NASDAQ:TSLA", "name": "Tesla Inc.", "type": "stock"},
    {"symbol": "NASDAQ:NVDA", "name": "NVIDIA Corp.", "type": "stock"}
]

def fetch_binance_klines(symbol, interval="1d", limit=50):
    """
    Fetches actual recent candle data from Binance public API if it's a Binance crypto symbol.
    """
    try:
        binance_symbol = symbol.split(":")[-1]
        # Map TradingView timeframes to Binance API intervals
        tv_to_binance = {
            "1": "1m", "5": "5m", "15": "15m", "30": "30m",
            "60": "1h", "240": "4h", "D": "1d", "W": "1w"
        }
        binance_interval = tv_to_binance.get(interval, "1d")
        
        url = f"https://api.binance.com/api/v3/klines?symbol={binance_symbol}&interval={binance_interval}&limit={limit}"
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            # Format: [ [time, open, high, low, close, volume, ...], ... ]
            candles = []
            for item in data:
                candles.append({
                    "time": int(item[0]),
                    "open": float(item[1]),
                    "high": float(item[2]),
                    "low": float(item[3]),
                    "close": float(item[4]),
                    "volume": float(item[5])
                })
            return candles
    except Exception as e:
        logger.warning(f"Failed to fetch real-time Binance data for {symbol}: {e}. Falling back to simulation.")
        return None

def generate_simulated_candles(symbol, interval="D", limit=50):
    """
    Generates extremely realistic candle data when APIs fail or for stock symbols.
    """
    candles = []
    base_price = 100.0
    if "BTC" in symbol:
        base_price = 65000.0
    elif "ETH" in symbol:
        base_price = 3500.0
    elif "SOL" in symbol:
        base_price = 140.0
    elif "AAPL" in symbol:
        base_price = 180.0
    elif "TSLA" in symbol:
        base_price = 175.0
    elif "NVDA" in symbol:
        base_price = 120.0

    current_time = int(time.time() * 1000)
    # Define timeframe in milliseconds
    timeframe_ms = 86400000  # Default 1 day
    if interval == "1": timeframe_ms = 60000
    elif interval == "5": timeframe_ms = 300000
    elif interval == "15": timeframe_ms = 900000
    elif interval == "30": timeframe_ms = 1800000
    elif interval == "60": timeframe_ms = 3600000
    elif interval == "240": timeframe_ms = 14400000

    price = base_price
    for i in range(limit):
        t = current_time - (limit - i) * timeframe_ms
        change_pct = random.uniform(-0.02, 0.022)  # slight upward bias
        open_price = price
        close_price = price * (1 + change_pct)
        high_price = max(open_price, close_price) * (1 + random.uniform(0, 0.01))
        low_price = min(open_price, close_price) * (1 - random.uniform(0, 0.01))
        volume = random.uniform(1000, 50000)
        
        candles.append({
            "time": t,
            "open": round(open_price, 2),
            "high": round(high_price, 2),
            "low": round(low_price, 2),
            "close": round(close_price, 2),
            "volume": round(volume, 2)
        })
        price = close_price

    return candles

def calculate_technical_indicators(candles):
    """
    Computes simple indicators like SMA, EMA, RSI, and Support/Resistance levels.
    """
    closes = [c["close"] for c in candles]
    highs = [c["high"] for c in candles]
    lows = [c["low"] for c in candles]
    
    if len(closes) < 14:
        return {"rsi": 50, "sma_20": closes[-1], "peak": max(highs), "trough": min(lows)}

    # Simple Moving Average (20 periods)
    sma_20 = sum(closes[-20:]) / min(20, len(closes))
    
    # RSI (14 periods)
    gains = []
    losses = []
    for i in range(1, len(closes)):
        diff = closes[i] - closes[i-1]
        if diff >= 0:
            gains.append(diff)
            losses.append(0)
        else:
            gains.append(0)
            losses.append(abs(diff))
            
    avg_gain = sum(gains[-14:]) / 14
    avg_loss = sum(losses[-14:]) / 14
    
    if avg_loss == 0:
        rsi = 100
    else:
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))

    # Support / Resistance (simplified)
    peak = max(highs[-20:])
    trough = min(lows[-20:])

    return {
        "rsi": round(rsi, 2),
        "sma_20": round(sma_20, 2),
        "peak": round(peak, 2),
        "trough": round(trough, 2)
    }

def dispatch_webhooks(event_type, message, symbol, price):
    """
    Dispatches notifications to all registered webhook URLs.
    """
    payload = json.dumps({
        "event": event_type,
        "message": message,
        "symbol": symbol,
        "price": price,
        "timestamp": int(time.time())
    }).encode('utf-8')

    for url in webhook_urls:
        try:
            req = urllib.request.Request(
                url,
                data=payload,
                headers={'Content-Type': 'application/json', 'User-Agent': 'TradingBot-Alert-Engine'}
            )
            # Perform non-blocking/quick request using a small timeout
            with urllib.request.urlopen(req, timeout=2) as response:
                logger.info(f"Webhook sent successfully to {url}, code {response.getcode()}")
        except Exception as e:
            logger.error(f"Failed to send webhook to {url}: {e}")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/symbols")
def get_symbols():
    return jsonify(POPULAR_SYMBOLS)

@app.route("/api/prediction", methods=["GET"])
def get_prediction():
    symbol = request.args.get("symbol", "BINANCE:BTCUSDT")
    interval = request.args.get("interval", "D")
    
    # Try fetching real candles first, fallback to simulation
    candles = None
    if "BINANCE" in symbol:
        candles = fetch_binance_klines(symbol, interval)
    if not candles:
        candles = generate_simulated_candles(symbol, interval)

    indicators = calculate_technical_indicators(candles)
    current_price = candles[-1]["close"]
    
    # Calculate simple prediction
    # Combine RSI, slope of last 5 candles, and simple random volatility
    last_5_closes = [c["close"] for c in candles[-5:]]
    slope = (last_5_closes[-1] - last_5_closes[0]) / len(last_5_closes)
    
    prediction_change_pct = (slope / current_price) * 10
    if indicators["rsi"] > 70:
        prediction_change_pct -= 0.015  # overbought, tend to revert
    elif indicators["rsi"] < 30:
        prediction_change_pct += 0.015  # oversold, tend to bounce

    predicted_price = current_price * (1 + prediction_change_pct + random.uniform(-0.01, 0.01))
    
    direction = "UP" if predicted_price > current_price else "DOWN"
    confidence = min(95.0, max(45.0, 50.0 + abs(prediction_change_pct) * 2000 + random.uniform(-5, 5)))
    
    # Generate automated peak/valley message triggers
    alert_triggered = False
    alert_msg = ""
    
    if current_price >= indicators["peak"] * 0.99:
        alert_msg = f"PEAK WARNING: {symbol} current price ${current_price:,.2f} is testing its 20-period resistance level of ${indicators['peak']:,.2f}!"
        alert_triggered = True
        event_type = "PEAK_WARNING"
    elif current_price <= indicators["trough"] * 1.01:
        alert_msg = f"VALLEY ALERT: {symbol} current price ${current_price:,.2f} is at its 20-period support level of ${indicators['trough']:,.2f}!"
        alert_triggered = True
        event_type = "VALLEY_ALERT"

    if alert_triggered:
        alert_entry = {
            "time": time.strftime("%H:%M:%S"),
            "symbol": symbol,
            "message": alert_msg,
            "type": event_type
        }
        alert_logs.append(alert_entry)
        if len(alert_logs) > 50:
            alert_logs.pop(0)
        # Trigger webhook dispatch in a simplified background execution
        dispatch_webhooks(event_type, alert_msg, symbol, current_price)

    return jsonify({
        "current_price": round(current_price, 2),
        "predicted_price": round(predicted_price, 2),
        "direction": direction,
        "confidence": round(confidence, 1),
        "rsi": indicators["rsi"],
        "sma_20": indicators["sma_20"],
        "peak": indicators["peak"],
        "trough": indicators["trough"],
        "alert_triggered": alert_triggered,
        "alert_msg": alert_msg
    })

@app.route("/api/alerts")
def get_alerts():
    return jsonify(alert_logs)

@app.route("/api/webhooks", methods=["GET", "POST", "DELETE"])
def handle_webhooks():
    global webhook_urls
    if request.method == "POST":
        data = request.json or {}
        url = data.get("url")
        if url and url not in webhook_urls:
            webhook_urls.append(url)
            return jsonify({"status": "success", "message": f"Webhook registered: {url}", "webhooks": webhook_urls})
        return jsonify({"status": "error", "message": "Invalid URL or already registered"}), 400
        
    elif request.method == "DELETE":
        data = request.json or {}
        url = data.get("url")
        if url in webhook_urls:
            webhook_urls.remove(url)
            return jsonify({"status": "success", "message": f"Webhook deleted", "webhooks": webhook_urls})
        return jsonify({"status": "error", "message": "URL not found"}), 404
        
    else:  # GET
        return jsonify(webhook_urls)

@app.route("/api/trigger_mock_alert", methods=["POST"])
def trigger_mock_alert():
    """Endpoint to trigger a mock peak/valley alert for testing purposes."""
    data = request.json or {}
    symbol = data.get("symbol", "BINANCE:BTCUSDT")
    alert_type = data.get("type", "PEAK_WARNING")
    price = data.get("price", 68500.0)
    
    if alert_type == "PEAK_WARNING":
        msg = f"MOCK PEAK ALERT: {symbol} hit an all-time peak index projection at ${price:,.2f}!"
    else:
        msg = f"MOCK VALLEY ALERT: {symbol} hit an critical oversold support zone at ${price:,.2f}!"
        
    alert_entry = {
        "time": time.strftime("%H:%M:%S"),
        "symbol": symbol,
        "message": msg,
        "type": alert_type
    }
    alert_logs.append(alert_entry)
    dispatch_webhooks(alert_type, msg, symbol, price)
    return jsonify({"status": "success", "alert": alert_entry})

if __name__ == "__main__":
    # Standard local Flask port
    app.run(host="0.0.0.0", port=5001, debug=True)
