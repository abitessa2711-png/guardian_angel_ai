"""
Download pre-trained DNN models for face detection, gender classification, and age estimation.
Run from the backend directory: python app/models/download_models.py
"""
import urllib.request
import os
import sys

MODELS_DIR = os.path.dirname(os.path.abspath(__file__))

MODELS = {
    "face_detector": {
        "deploy.prototxt": "https://raw.githubusercontent.com/opencv/opencv/master/samples/dnn/face_detector/deploy.prototxt",
        "res10_300x300_ssd_iter_140000.caffemodel": "https://raw.githubusercontent.com/opencv/opencv_3rdparty/dnn_samples_face_detector_20170830/res10_300x300_ssd_iter_140000.caffemodel",
    },
    "gender_net": {
        "gender_deploy.prototxt": "https://raw.githubusercontent.com/spmallick/learnopencv/master/AgeGender/gender_deploy.prototxt",
        "gender_net.caffemodel": "https://www.dropbox.com/s/iyv483wz7ztr9gh/gender_net.caffemodel?dl=1",
    },
    "age_net": {
        "age_deploy.prototxt": "https://raw.githubusercontent.com/spmallick/learnopencv/master/AgeGender/age_deploy.prototxt",
        "age_net.caffemodel": "https://www.dropbox.com/s/xfb20y596869vbb/age_net.caffemodel?dl=1",
    },
}

def download_file(url, dest_path):
    """Download a file from URL to dest_path with progress."""
    if os.path.exists(dest_path):
        size_mb = os.path.getsize(dest_path) / (1024 * 1024)
        if size_mb > 0.01:  # skip if file already exists and is non-empty
            print(f"  Already exists: {os.path.basename(dest_path)} ({size_mb:.1f} MB)")
            return True
    
    print(f"  Downloading {os.path.basename(dest_path)}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=120) as response:
            data = response.read()
            with open(dest_path, 'wb') as f:
                f.write(data)
        size_mb = os.path.getsize(dest_path) / (1024 * 1024)
        print(f"  Downloaded {os.path.basename(dest_path)} ({size_mb:.1f} MB)")
        return True
    except Exception as e:
        print(f"  Error downloading {os.path.basename(dest_path)}: {e}")
        return False

def main():
    print(f"Models directory: {MODELS_DIR}\n")
    
    all_ok = True
    for group_name, files in MODELS.items():
        print(f"Downloading {group_name} models...")
        for filename, url in files.items():
            dest = os.path.join(MODELS_DIR, filename)
            if not download_file(url, dest):
                all_ok = False
        print()
    
    if all_ok:
        print("All models downloaded successfully!")
    else:
        print("Some models failed to download. The system will fallback gracefully.")
    
    return 0 if all_ok else 1

if __name__ == "__main__":
    sys.exit(main())
