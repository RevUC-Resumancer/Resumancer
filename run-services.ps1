# PowerShell script to run both frontend and backend servers

# Navigate to the frontend directory and start the React app
Write-Host "Starting React app..."
cd .\frontend
npm install
Start-Process npm -ArgumentList "run dev"

# Navigate to the backend directory and start the backend server
Write-Host "Setting up the backend..."
cd ..\backend
pip install -r requirements.txt
Start-Process python -ArgumentList "-m app.main"
