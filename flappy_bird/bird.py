import pygame
import sys

class Bird:
    def __init__(self, x, y, width, height):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.velocity = 0
        self.gravity = 0.25
        self.jump_strength = -5

    def update(self):
        self.velocity += self.gravity
        self.y += self.velocity

    def draw(self, surface):
        pygame.draw.rect(surface, (255, 255, 255), (self.x, self.y, self.width, self.height))

    def handle_collision(self, rect):
        return self.y < rect.top or self.y + self.height > rect.bottom

    def reset(self):
        self.y = self.height // 2
        self.velocity = 0