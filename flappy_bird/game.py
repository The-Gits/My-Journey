import pygame as pygame
import sys
from bird import Bird
from pipes import PipeGenerator

class Game:
    def __init__(self):
        pygame.init()
        self.screen_width = 400
        self.screen_height = 600
        self.screen = pygame.display.set_mode((self.screen_width, self.screen_height))
        pygame.display.set_caption("Flappy Bird")
        self.clock = pygame.time.Clock()
        self.font = pygame.font.SysFont('Arial', 30)

        self.bird = Bird(100, self.screen_height // 2, 30, 30)
        self.pipe_generator = PipeGenerator(30, self.screen_height)
        self.score = 0
        self.game_over = False
        self.last_pipe_spawn = pygame.time.get_ticks()

    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE and not self.game_over:
                    self.bird.velocity = self.bird.jump_strength

    def update(self):
        if not self.game_over:
            self.bird.update()
            self.pipe_generator.generate_pipe()
            self.pipe_generator.update()

            if self.pipe_generator.check_collision(self.bird):
                self.game_over = True

            if self.last_pipe_spawn + 1000 < pygame.time.get_ticks():
                self.score += 1
                self.last_pipe_spawn = pygame.time.get_ticks()

    def draw(self):
        self.screen.fill((0, 0, 0))
        self.bird.draw(self.screen)
        self.pipe_generator.draw(self.screen)

        score_text = self.font.render(f"Score: {self.score}", True, (255, 255, 255))
        self.screen.blit(score_text, (10, 10))

        if self.game_over:
            game_over_text = self.font.render("Game Over! Press SPACE to restart", True, (255, 255, 255))
            self.screen.blit(game_over_text, (self.screen_width // 2 - 180, self.screen_height // 2))

        pygame.display.flip()

    def run(self):
        while True:
            self.handle_events()
            self.update()
            self.draw()
            self.clock.tick(60)

if __name__ == "__main__":
    game = Game()
    game.run()