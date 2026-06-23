import pygame
import random

class Pipe:
    def __init__(self, x, width, height, gap=150):
        self.x = x
        self.width = width
        self.height = height
        self.gap = gap
        self.top_pipe = pygame.Rect(x, 0, width, height - gap)
        self.bottom_pipe = pygame.Rect(x, height - gap, width, height)

    def update(self):
        self.x -= 2

    def draw(self, surface):
        pygame.draw.rect(surface, (0, 255, 0), self.top_pipe)
        pygame.draw.rect(surface, (0, 255, 0), self.bottom_pipe)

    def collide(self, bird):
        return bird.handle_collision(self.top_pipe) or bird.handle_collision(self.bottom_pipe)

    def off_screen(self):
        return self.x < -self.width

class PipeGenerator:
    def __init__(self, width, height, gap=150):
        self.width = width
        self.height = height
        self.gap = gap
        self.pipes = []
        self.last_pipe_x = 0
        self.pipes_spawn_rate = 150  # pixels

    def generate_pipe(self):
        self.last_pipe_x = pygame.time.get_ticks()
        pipe = Pipe(self.last_pipe_x + self.pipes_spawn_rate, self.width, self.height)
        self.pipes.append(pipe)

    def update(self):
        for pipe in self.pipes:
            pipe.update()
            if pipe.off_screen():
                self.pipes.remove(pipe)

    def draw(self, surface):
        for pipe in self.pipes:
            pipe.draw(surface)

    def check_collision(self, bird):
        for pipe in self.pipes:
            if pipe.collide(bird):
                return True
        return False