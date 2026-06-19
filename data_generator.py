import random
import math

# =====================================================
# SYNTHETIC TLE GENERATOR
# =====================================================

NUM_SATELLITES = 200

output_file = "datasets/active.txt"

names = [
    "STARLINK",
    "ONEWEB",
    "ISROSAT",
    "NAVIC",
    "CYBERSAT",
    "DEFENSESAT",
    "DIGITALTWIN",
    "AI-SAT",
    "RESEARCHSAT",
    "ORBITX"
]

# =====================================================
# GENERATE SYNTHETIC TLE
# =====================================================

with open(output_file, "w") as f:

    for i in range(NUM_SATELLITES):
        sat_name = random.choice(names) + "-" + str(i+1)

        sat_number = str(10000 + i)

        inclination = round(random.uniform(20, 98), 4)
        raan = round(random.uniform(0, 360), 4)
        eccentricity = random.randint(100000, 999999)
        arg_perigee = round(random.uniform(0, 360), 4)
        mean_anomaly = round(random.uniform(0, 360), 4)
        mean_motion = round(random.uniform(14.0, 16.0), 8)

        line1 = (
            f"1 {sat_number}U 24001A   24138.50000000  .00001264  00000-0  29661-4 0  999{i%10}"
        )

        line2 = (
            f"2 {sat_number} "
            f"{inclination:8.4f} "
            f"{raan:8.4f} "
            f"{eccentricity:07d} "
            f"{arg_perigee:8.4f} "
            f"{mean_anomaly:8.4f} "
            f"{mean_motion:11.8f}0000"
        )

        f.write(sat_name + "\n")
        f.write(line1 + "\n")
        f.write(line2 + "\n")
    

print("Synthetic active.txt generated successfully")
print("Satellites:", NUM_SATELLITES)