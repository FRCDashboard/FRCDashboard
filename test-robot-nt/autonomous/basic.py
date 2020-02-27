from magicbot import AutonomousStateMachine, timed_state

from components.shooter import Shooter


def Basic(AutonomousStateMachine):
    MODE_NAME = "Mode 1"
    DEFAULT = True

    shooter: Shooter

    @timed_state(duration=10, first=True, next_state="test")
    def start(self):
        self.shooter.shoot()

    @timed_state(duration=3)
    def test(self):
        pass
