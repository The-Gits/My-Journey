// Global App State (with localStorage persistence)
const state = {
    currentSymbol: localStorage.getItem("currentSymbol") || "BINANCE:BTCUSDT",
    currentTimeframe: localStorage.getItem("currentTimeframe") || "D",
    symbols: []
};

// DOM Elements
const symbolSelect = document.getElementById("symbol-select");
const timeframeSelect = document.getElementById("timeframe-select");
const headerSymbol = document.getElementById("header-symbol");
const refreshChartBtn = document.getElementById("refresh-chart-btn");

// Prediction Panel elements
const predDirection = document.getElementById("pred-direction");
const predDirectionText = document.getElementById("pred-direction-text");
const predConfidence = document.getElementById("pred-confidence");
const predTarget = document.getElementById("pred-target");
const metricPrice = document.getElementById("metric-price");
const metricRsi = document.getElementById("metric-rsi");
const metricSma = document.getElementById("metric-sma");
const runPredictionBtn = document.getElementById("run-prediction-btn");

// Webhooks
const webhookUrlInput = document.getElementById("webhook-url-input");
const registerWebhookBtn = document.getElementById("register-webhook-btn");
const webhookList = document.getElementById("webhook-list");

// Logs & Mock Alerts
const logsContainer = document.getElementById("logs-container");
const mockPeakBtn = document.getElementById("mock-peak-btn");
const mockValleyBtn = document.getElementById("mock-valley-btn");

// Toast Notification
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");

// Initialize TradingView Widget
function loadTradingViewChart(symbol, interval) {
    // Clear any previous container
    const container = document.getElementById("tradingview_chart_container");
    container.innerHTML = "";
    
    // Create new widget instance
    new TradingView.widget({
        "autosize": true,
        "symbol": symbol,
        "interval": interval,
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1", // Candlestick style
        "locale": "en",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "container_id": "tradingview_chart_container",
        "hide_side_toolbar": false,
        "studies": [
            "RSI@tv-basicstudies",
            "MASimple@tv-basicstudies"
        ],
        "loading_screen": {
            "backgroundColor": "#0d1224",
            "foregroundColor": "#00f2fe"
        }
    });
}

// Show Custom Toast
function showToast(message, isAlert = false) {
    toastMessage.textContent = message;
    toast.className = "toast-notification";
    if (isAlert) {
        toast.style.borderColor = "#ff1744";
        toast.querySelector("i").style.color = "#ff1744";
    } else {
        toast.style.borderColor = "#00f2fe";
        toast.querySelector("i").style.color = "#00f2fe";
    }
    
    // Show toast
    toast.classList.remove("hidden");
    
    // Hide toast after 4s
    setTimeout(() => {
        toast.classList.add("hidden");
    }, 4000);
}

// Fetch Symbols from Backend
async function fetchSymbols() {
    try {
        const response = await fetch("/api/symbols");
        const data = await response.json();
        state.symbols = data;
        
        symbolSelect.innerHTML = "";
        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.symbol;
            option.textContent = `${item.name} (${item.symbol.split(":")[1]})`;
            if (item.symbol === state.currentSymbol) {
                option.selected = true;
            }
            symbolSelect.appendChild(option);
        });
    } catch (err) {
        console.error("Error fetching symbols:", err);
    }
}

// Fetch and Execute Prediction Analysis
async function executePrediction() {
    runPredictionBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Running Analysis...';
    runPredictionBtn.disabled = true;
    
    try {
        const response = await fetch(`/api/prediction?symbol=${encodeURIComponent(state.currentSymbol)}&interval=${state.currentTimeframe}`);
        const data = await response.json();
        
        // Update price metrics
        metricPrice.textContent = `$${data.current_price.toLocaleString()}`;
        metricRsi.textContent = data.rsi;
        metricSma.textContent = `$${data.sma_20.toLocaleString()}`;
        
        // Update Prediction Box
        predConfidence.textContent = `${data.confidence}%`;
        predTarget.textContent = `$${data.predicted_price.toLocaleString()}`;
        
        // Strategy signals update logic
        const useSMA = document.getElementById("strat-sma").checked;
        const useRSI = document.getElementById("strat-rsi").checked;
        
        let customDirection = data.direction;
        if (useRSI && data.rsi > 70) {
            customDirection = "DOWN"; // Oversold strategy correction
        } else if (useRSI && data.rsi < 30) {
            customDirection = "UP";
        }
        
        if (customDirection === "UP") {
            predDirection.className = "pred-direction UP";
            predDirection.innerHTML = '<i class="fa-solid fa-arrow-trend-up"></i> <span id="pred-direction-text">BULLISH</span>';
        } else {
            predDirection.className = "pred-direction DOWN";
            predDirection.innerHTML = '<i class="fa-solid fa-arrow-trend-down"></i> <span id="pred-direction-text">BEARISH</span>';
        }

        // Trigger Alert if backend triggered it
        if (data.alert_triggered) {
            showToast(data.alert_msg, true);
            fetchAlertLogs();
        } else {
            showToast("Prediction analysis complete.");
        }
        
    } catch (err) {
        console.error("Error calculating predictions:", err);
        showToast("Failed to compute prediction analysis.", true);
    } finally {
        runPredictionBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Execute Prediction Analysis';
        runPredictionBtn.disabled = false;
    }
}

// Fetch Alert Logs
async function fetchAlertLogs() {
    try {
        const response = await fetch("/api/alerts");
        const logs = await response.json();
        
        if (logs.length === 0) {
            logsContainer.innerHTML = '<div class="empty-logs">No alert logs captured yet. Trigger predictions or mock alerts to start.</div>';
            return;
        }
        
        logsContainer.innerHTML = "";
        // Render in reverse chronological order
        logs.slice().reverse().forEach(log => {
            const entry = document.createElement("div");
            entry.className = `log-entry ${log.type}`;
            
            entry.innerHTML = `
                <span class="log-time">[${log.time}]</span>
                <span class="log-symbol">${log.symbol.split(":")[1]}</span>
                <span class="log-message">${log.message}</span>
            `;
            logsContainer.appendChild(entry);
        });
    } catch (err) {
        console.error("Error fetching alerts:", err);
    }
}

// Trigger Mock Alerts
async function triggerMock(type) {
    try {
        let price = 68000;
        if (state.currentSymbol.includes("ETH")) price = 3600;
        if (state.currentSymbol.includes("AAPL")) price = 190;
        
        const response = await fetch("/api/trigger_mock_alert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                symbol: state.currentSymbol,
                type: type,
                price: price
            })
        });
        const data = await response.json();
        if (data.status === "success") {
            showToast(data.alert.message, type === "VALLEY_ALERT");
            fetchAlertLogs();
        }
    } catch (err) {
        console.error("Error triggering mock alert:", err);
    }
}

// Webhook management
async function fetchWebhooks() {
    try {
        const response = await fetch("/api/webhooks");
        const list = await response.json();
        
        webhookList.innerHTML = "";
        if (list.length === 0) {
            webhookList.innerHTML = '<li style="color: var(--text-secondary); font-size: 0.7rem; justify-content: center;">No active webhooks</li>';
            return;
        }
        
        list.forEach(url => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${url}</span>
                <button class="webhook-delete-btn" data-url="${url}"><i class="fa-solid fa-trash"></i></button>
            `;
            webhookList.appendChild(li);
        });
        
        // Add delete listeners
        document.querySelectorAll(".webhook-delete-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const targetUrl = btn.getAttribute("data-url");
                await deleteWebhook(targetUrl);
            });
        });
    } catch (err) {
        console.error("Error loading webhooks:", err);
    }
}

async function registerWebhook() {
    const url = webhookUrlInput.value.trim();
    if (!url) return;
    
    try {
        const response = await fetch("/api/webhooks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: url })
        });
        const data = await response.json();
        if (response.ok) {
            showToast("Webhook registered successfully!");
            webhookUrlInput.value = "";
            fetchWebhooks();
        } else {
            showToast(data.message, true);
        }
    } catch (err) {
        console.error("Error registering webhook:", err);
        showToast("Error registering webhook.", true);
    }
}

async function deleteWebhook(url) {
    try {
        const response = await fetch("/api/webhooks", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: url })
        });
        if (response.ok) {
            showToast("Webhook deleted.");
            fetchWebhooks();
        }
    } catch (err) {
        console.error("Error deleting webhook:", err);
    }
}

// Event Listeners Setup
function setupListeners() {
    symbolSelect.addEventListener("change", (e) => {
        state.currentSymbol = e.target.value;
        localStorage.setItem("currentSymbol", state.currentSymbol);
        const displaySym = state.currentSymbol.split(":")[1] || state.currentSymbol;
        headerSymbol.textContent = displaySym;
        loadTradingViewChart(state.currentSymbol, state.currentTimeframe);
        executePrediction();
    });

    timeframeSelect.addEventListener("change", (e) => {
        state.currentTimeframe = e.target.value;
        localStorage.setItem("currentTimeframe", state.currentTimeframe);
        loadTradingViewChart(state.currentSymbol, state.currentTimeframe);
        executePrediction();
    });

    // Persistent Strategy Checkboxes
    const stratSma = document.getElementById("strat-sma");
    const stratRsi = document.getElementById("strat-rsi");
    const stratMacd = document.getElementById("strat-macd");

    stratSma.addEventListener("change", (e) => {
        localStorage.setItem("strat-sma", e.target.checked);
        executePrediction();
    });
    stratRsi.addEventListener("change", (e) => {
        localStorage.setItem("strat-rsi", e.target.checked);
        executePrediction();
    });
    stratMacd.addEventListener("change", (e) => {
        localStorage.setItem("strat-macd", e.target.checked);
        executePrediction();
    });

    refreshChartBtn.addEventListener("click", () => {
        loadTradingViewChart(state.currentSymbol, state.currentTimeframe);
        showToast("Chart widget reloaded.");
    });

    runPredictionBtn.addEventListener("click", executePrediction);

    registerWebhookBtn.addEventListener("click", registerWebhook);
    webhookUrlInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") registerWebhook();
    });

    mockPeakBtn.addEventListener("click", () => triggerMock("PEAK_WARNING"));
    mockValleyBtn.addEventListener("click", () => triggerMock("VALLEY_ALERT"));
}

// App Entry Point
async function initApp() {
    // Restore persistent Strategy toggles from localStorage
    const stratSma = document.getElementById("strat-sma");
    const stratRsi = document.getElementById("strat-rsi");
    const stratMacd = document.getElementById("strat-macd");

    if (localStorage.getItem("strat-sma") !== null) {
        stratSma.checked = localStorage.getItem("strat-sma") === "true";
    }
    if (localStorage.getItem("strat-rsi") !== null) {
        stratRsi.checked = localStorage.getItem("strat-rsi") === "true";
    }
    if (localStorage.getItem("strat-macd") !== null) {
        stratMacd.checked = localStorage.getItem("strat-macd") === "true";
    }

    // Set Timeframe dropdown selection
    timeframeSelect.value = state.currentTimeframe;

    setupListeners();
    await fetchSymbols();
    
    // Set Header symbol and dropdown selection
    const displaySym = state.currentSymbol.split(":")[1] || state.currentSymbol;
    headerSymbol.textContent = displaySym;
    symbolSelect.value = state.currentSymbol;

    loadTradingViewChart(state.currentSymbol, state.currentTimeframe);
    await executePrediction();
    await fetchAlertLogs();
    await fetchWebhooks();
}

// Run on Load
window.addEventListener("DOMContentLoaded", initApp);
