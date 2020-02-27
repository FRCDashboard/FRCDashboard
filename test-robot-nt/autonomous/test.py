from magicbot import AutonomousStateMachine, timed_state

from components.shooter import Shooter


def Test1(AutonomousStateMachine):
    MODE_NAME = "Test Autonomous Mode #1"
    DEFAULT = True

    shooter: Shooter

    @timed_state(duration=10, first=True, next_state="done")
    def start(self):
        self.shooter.shoot()
