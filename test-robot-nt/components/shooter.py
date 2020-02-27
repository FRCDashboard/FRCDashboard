from magicbot import tunable, will_reset_to
from wpilib import SmartDashboard as sd


class Shooter:
    is_aimed = will_reset_to(False)
    shooter_motor_speed = 0
    shooter_output = will_reset_to(0)
    shooter_ready = will_reset_to(False)
    shooter_speed_target = will_reset_to(0)
    targets_found = will_reset_to(False)

    target_rpm = tunable(-4500)
    feed_speed_setpoint = tunable(-1)
    rpm_error = tunable(300)
    x_aim_error = tunable(1)
    y_aim_error = tunable(0)

    def shoot(self):
        self.shooter_speed_target = self.target_rpm

    def execute(self):
        err = self.shooter_speed_target - self.shooter_motor_speed
        speed_change = max(min(err, 50), -50)
        self.shooter_motor_speed += speed_change
        sd.putBoolean("isAimed", self.is_aimed)
        sd.putNumber("shooterMotorSpeed", abs(self.shooter_motor_speed))
        sd.putNumber("shooterOutput", self.shooter_output)
        sd.putBoolean("shooterReady", self.shooter_ready)
        sd.putNumber("shooterSpeedTarget", abs(self.shooter_speed_target))
        sd.putBoolean("targetsFound", self.targets_found)
