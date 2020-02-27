import wpilib
from wpilib import SmartDashboard as sd

from magicbot import MagicRobot

from components.drivetrain import Drivetrain
from components.intake import Intake
from components.shooter import Shooter


class Robot(MagicRobot):

    drivetrain: Drivetrain
    intake: Intake
    shooter: Shooter

    def createObjects(self):
        self.joystick = wpilib.Joystick(0)

    def teleopPeriodic(self):
        if self.joystick.getRawAxis(2) > 0.75:
            self.shooter.shoot()


if __name__ == "__main__":
    wpilib.run(Robot)
