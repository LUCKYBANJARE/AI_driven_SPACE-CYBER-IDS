## Dataset

This project uses a combined dataset repository containing multiple data sources for space-cyber intrusion detection research.

### Included Datasets

1. **CICIDS2017 Dataset**  
   Benchmark intrusion detection dataset containing normal and malicious network traffic used for cyberattack classification.

2. **Extended Attack Simulation (EAS) Dataset**  
   Simulated attack dataset designed for anomaly detection and adversarial cyber scenarios in space-ground communication systems.

3. **TLE and Satellite Operational Data**  
   Includes orbital and operational telemetry data from OneWeb and Starlink.

4. **Additional Supporting Space Datasets**  
   Includes satellite history, debris tracking, maneuver logs, and operational metadata.

---

## Download Dataset

Download all required datasets from the Kaggle repository below:

**Kaggle Dataset Link:**  
https://www.kaggle.com/datasets/luckybanjare/space-ids-cicids

After downloading, extract and place them inside the project root under:

```text
datasets/
```

### Required Project Structure

```text
datasets/
├── cicids_dataset/
├── EAS_train_data.csv
├── EAS_test_data.csv
├── tle_and_manuever/
├── starlink.csv
├── oneweb.csv
├── space_debris_dataset.csv
└── other supporting files
```

### Official Reference Dataset Source

CICIDS2017 Official Source:  
https://www.unb.ca/cic/datasets/ids-2017.html
