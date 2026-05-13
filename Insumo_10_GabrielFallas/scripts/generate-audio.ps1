# Generates short English demo audios (WAV) using Windows SAPI.
# Output: public/audio/*.wav

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root 'public/audio'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function New-WavFromText {
  param(
    [Parameter(Mandatory = $true)][string]$Text,
    [Parameter(Mandatory = $true)][string]$OutFile
  )

  $voice = New-Object -ComObject SAPI.SpVoice
  $stream = New-Object -ComObject SAPI.SpFileStream

  # 3 = SSFMCreateForWrite
  $stream.Open($OutFile, 3, $false)

  $voice.AudioOutputStream = $stream
  $voice.Rate = 0
  $voice.Volume = 100

  [void]$voice.Speak($Text)

  $stream.Close()
}

New-WavFromText -Text 'Hi, I am Alicia. I can help you plan a trip to Japan with seasonal routes, food recommendations, and practical travel tips.' -OutFile (Join-Path $outDir 'alicia.wav')
New-WavFromText -Text 'Hello, I am Zed. If you are considering a STEM degree, I can share real robotics and AI projects and help you choose a first step.' -OutFile (Join-Path $outDir 'zed.wav')
New-WavFromText -Text 'Hi, I am Yuki. I can guide your workouts, adapt to your level, and share general nutrition tips to support your goals.' -OutFile (Join-Path $outDir 'yuki.wav')

Get-ChildItem $outDir -Filter '*.wav' | Select-Object Name, Length
