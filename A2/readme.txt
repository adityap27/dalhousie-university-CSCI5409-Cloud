Connect to EC2: ssh -i key-pair-01.pem ec2-user@<public-ip-of-ec2-instance>

1. Create and activate python environment, install pip for root user. (we need to run flask app with sudo in-order to use port 80)
python3 -m venv myenv
source myenv/bin/activate
sudo yum -y install python-pip

2. Copy Directory from local to EC2 (Run this on local machine)
scp -i key-pair-01.pem -r ./flask-app ec2-user@<public-ip-of-ec2-instance>:~/

3. Install requirements on EC2 and start flask app
cd flask-app
sudo pip install -r requirements.txt
sudo python3 app.py

