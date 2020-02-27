from magicbot import tunable, will_reset_to
from wpilib import SmartDashboard as sd


class Drivetrain:
    forward_speed = will_reset_to(0)
    turn_speed = will_reset_to(0)

    vision_dist_kP = tunable(0.3)
    vision_dist_kI = tunable(0)
    vision_dist_kD = tunable(0)
    vision_turn_kP = tunable(0.3)
    vision_turn_kI = tunable(0)
    vision_turn_kD = tunable(0)

    def execute(self):
        sd.putNumber("forwardSpeed", self.forward_speed)
        sd.putNumber("turnSpeed", self.turn_speed)
