## Dataset

This project uses the following datasets:

### 1. CICIDS2017 Dataset
A benchmark intrusion detection dataset containing benign and malicious network traffic for training and evaluating IDS models.

**Official Source:**  
https://www.unb.ca/cic/datasets/ids-2017.html

---

### 2. Extended Attack Simulation (EAS) Dataset
Custom attack simulation dataset used for space-ground cyber intrusion analysis and anomaly detection.

---

### 3. TLE and Satellite Operational Data
This includes Two-Line Element (TLE) data and operational satellite information collected from:

- :contentReference[oaicite:0]{index=0}
- :contentReference[oaicite:1]{index=1}

---

## Download Dataset

Download all datasets from the Kaggle repository:

:contentReference[oaicite:2]{index=2}

After downloading, place them inside the `datasets/` directory.

### Required Project Structure

```text
datasets/
├── cicids_dataset/
├── EAS_train_data.csv
├── tle_and_manoeuvre/
├── starlink.csv
├── oneweb.csv
└── other supporting files
```
