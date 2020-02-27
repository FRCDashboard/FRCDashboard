from magicbot import tunable, will_reset_to
from wpilib import SmartDashboard as sd


class Intake:
    arm_position = will_reset_to(0)
    arm_power = will_reset_to(0)
    intake_in = will_reset_to(False)
    intake_speed = will_reset_to(0)

    def execute(self):
        sd.putNumber("armPosition", self.arm_position)
        sd.putNumber("armPower", self.arm_power)
        sd.putBoolean("intakeIn", self.intake_in)
        sd.putNumber("intakeSpeed", self.intake_speed)
