using UnityEngine;
using System.Collections;

public class talking : StateMachineBehaviour
{
    [Header("Audio Settings")]
    [SerializeField] private AudioClip audioClip;
    [SerializeField] private bool useExistingAudioSource = true;
    [SerializeField] private bool autoPlayAudioClip = true;
    [SerializeField] private float audioDelay = 0f; // Delay before playing audio
    [SerializeField] private float lipSyncSensitivity = 1.5f;
    [SerializeField] private float smoothness = 8f;
    
    [Header("Viseme Intensities")]
    [SerializeField] private float silenceThreshold = 0.01f;
    [SerializeField] private float vowelAIntensity = 80f;    // "ah" sound
    [SerializeField] private float vowelEIntensity = 60f;    // "eh" sound  
    [SerializeField] private float vowelIIntensity = 40f;    // "ee" sound
    [SerializeField] private float vowelOIntensity = 90f;    // "oh" sound
    [SerializeField] private float vowelUIntensity = 70f;    // "oo" sound
    [SerializeField] private float consonantIntensity = 50f; // general consonants
    [SerializeField] private float mBPIntensity = 85f;       // M, B, P sounds
    
    // Audio analysis
    private AudioSource audioSource;
    private float[] spectrumData = new float[512];
    private float currentVolume = 0f;
    
    // Cached blend shape indices
    private int jawOpenIndex = -1;
    private int mouthAIndex = -1;
    private int mouthEIndex = -1;
    private int mouthIIndex = -1;
    private int mouthOIndex = -1;
    private int mouthUIndex = -1;
    private int mouthPressIndex = -1;
    private int mouthPuckerIndex = -1;
    
    // Current viseme weights
    private float targetJawOpen = 0f;
    private float targetMouthA = 0f;
    private float targetMouthE = 0f;
    private float targetMouthI = 0f;
    private float targetMouthO = 0f;
    private float targetMouthU = 0f;
    private float targetMouthPress = 0f;
    private float targetMouthPucker = 0f;
    
    // Timer for delayed audio playback
    private float audioStartTimer = 0f;
    private bool audioStarted = false;

    // OnStateEnter is called when a transition starts and the state machine starts to evaluate this state
    override public void OnStateEnter(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        // Get or create AudioSource
        audioSource = animator.GetComponent<AudioSource>();
        
        if (audioSource == null)
        {
            if (useExistingAudioSource)
            {
                Debug.LogWarning("No existing AudioSource found. Creating new one for lip sync.");
            }
            
            // Create AudioSource if it doesn't exist
            audioSource = animator.gameObject.AddComponent<AudioSource>();
            
            // Set some reasonable defaults for the new AudioSource
            if (audioSource != null)
            {
                audioSource.playOnAwake = false;
                audioSource.spatialBlend = 0f; // 2D sound by default
            }
        }
        
        if (audioSource == null)
        {
            Debug.LogError("Failed to create AudioSource for lip sync!");
            return;
        }
        
        // Cache blend shape indices
        SkinnedMeshRenderer smr = animator.GetComponent<SkinnedMeshRenderer>();
        if (smr != null && smr.sharedMesh != null)
        {
            CacheBlendShapeIndices(smr);
        }
        
        // Handle audio playback
        if (audioClip != null && autoPlayAudioClip)
        {
            if (audioDelay > 0f)
            {
                // Setup delayed audio playback
                audioStartTimer = 0f;
                audioStarted = false;
                audioSource.clip = audioClip;
            }
            else
            {
                // Play immediately
                audioSource.clip = audioClip;
                audioSource.Play();
                audioStarted = true;
            }
        }
        else if (!useExistingAudioSource && audioClip != null)
        {
            // Just assign the clip but don't auto-play
            audioSource.clip = audioClip;
            audioStarted = false;
        }
        else
        {
            audioStarted = true; // No delay needed for existing audio
        }
    }

    // OnStateUpdate is called on each Update frame between OnStateEnter and OnStateExit callbacks
    override public void OnStateUpdate(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        // Handle delayed audio start
        if (!audioStarted && audioDelay > 0f && audioClip != null && autoPlayAudioClip)
        {
            audioStartTimer += Time.deltaTime;
            if (audioStartTimer >= audioDelay)
            {
                audioSource.Play();
                audioStarted = true;
            }
        }
        
        if (audioSource == null || !audioSource.isPlaying)
            return;
            
        SkinnedMeshRenderer smr = animator.GetComponent<SkinnedMeshRenderer>();
        if (smr == null || smr.sharedMesh == null)
            return;
        
        // Analyze audio
        AnalyzeAudio();
        
        // Calculate viseme weights based on audio analysis
        CalculateVisemeWeights();
        
        // Apply smooth blend shape transitions
        ApplyLipSyncBlendShapes(smr);
    }

    // OnStateExit is called when a transition ends and the state machine finishes evaluating this state
    override public void OnStateExit(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        // Reset all mouth blend shapes to neutral
        SkinnedMeshRenderer smr = animator.GetComponent<SkinnedMeshRenderer>();
        if (smr != null && smr.sharedMesh != null)
        {
            ResetMouthBlendShapes(smr);
        }
        
        // Stop audio if we're managing it and auto-play is enabled
        if (audioSource != null && autoPlayAudioClip && audioClip != null)
        {
            audioSource.Stop();
        }
        
        // Reset audio timer state
        audioStartTimer = 0f;
        audioStarted = false;
    }
    
    private void CacheBlendShapeIndices(SkinnedMeshRenderer smr)
    {
        // Try multiple naming conventions for each blend shape
        jawOpenIndex = smr.sharedMesh.GetBlendShapeIndex("jawForward");
        mouthAIndex = smr.sharedMesh.GetBlendShapeIndex("viseme_aa");
        mouthEIndex = smr.sharedMesh.GetBlendShapeIndex("viseme_E");
        mouthIIndex = smr.sharedMesh.GetBlendShapeIndex("viseme_I");
        mouthOIndex = smr.sharedMesh.GetBlendShapeIndex("viseme_O");
        mouthUIndex = smr.sharedMesh.GetBlendShapeIndex("viseme_U");
        mouthPressIndex = smr.sharedMesh.GetBlendShapeIndex("viseme_PP");
        mouthPuckerIndex = smr.sharedMesh.GetBlendShapeIndex("mouthPucker");
    }
    
    private void AnalyzeAudio()
    {
        // Get spectrum data from audio
        audioSource.GetSpectrumData(spectrumData, 0, FFTWindow.BlackmanHarris);
        
        // Calculate overall volume
        float sum = 0f;
        for (int i = 0; i < spectrumData.Length; i++)
        {
            sum += spectrumData[i];
        }
        currentVolume = sum * lipSyncSensitivity;
    }
    
    private void CalculateVisemeWeights()
    {
        // Reset all targets
        targetJawOpen = 0f;
        targetMouthA = 0f;
        targetMouthE = 0f;
        targetMouthI = 0f;
        targetMouthO = 0f;
        targetMouthU = 0f;
        targetMouthPress = 0f;
        targetMouthPucker = 0f;
        
        // If volume is too low, stay silent
        if (currentVolume < silenceThreshold)
            return;
        
        // Analyze frequency ranges to determine visemes
        float lowFreq = GetFrequencyRange(0, 50);      // Low frequencies (0-50)
        float lowMidFreq = GetFrequencyRange(50, 150);  // Low-mid frequencies (50-150)
        float midFreq = GetFrequencyRange(150, 250);    // Mid frequencies (150-250)
        float highMidFreq = GetFrequencyRange(250, 350); // High-mid frequencies (250-350)
        float highFreq = GetFrequencyRange(350, 512);   // High frequencies (350-512)
        
        // Basic jaw opening based on overall volume
        targetJawOpen = Mathf.Clamp(currentVolume * 100f, 0f, 100f);
        
        // Map frequency ranges to visemes (simplified phoneme detection)
        if (lowFreq > highFreq && lowMidFreq > midFreq)
        {
            // Low frequencies dominant - likely vowel sounds like "O" or "U"
            if (lowFreq > lowMidFreq)
            {
                targetMouthO = Mathf.Min(vowelOIntensity, currentVolume * vowelOIntensity);
            }
            else
            {
                targetMouthU = Mathf.Min(vowelUIntensity, currentVolume * vowelUIntensity);
            }
        }
        else if (midFreq > lowFreq && midFreq > highFreq)
        {
            // Mid frequencies dominant - likely "A" or "E" sounds
            if (lowMidFreq > highMidFreq)
            {
                targetMouthA = Mathf.Min(vowelAIntensity, currentVolume * vowelAIntensity);
            }
            else
            {
                targetMouthE = Mathf.Min(vowelEIntensity, currentVolume * vowelEIntensity);
            }
        }
        else if (highFreq > lowFreq)
        {
            // High frequencies dominant - likely "I" sound or consonants
            if (highMidFreq > highFreq * 0.7f)
            {
                targetMouthI = Mathf.Min(vowelIIntensity, currentVolume * vowelIIntensity);
            }
            else
            {
                // Consonants - use mouth press for plosive sounds
                targetMouthPress = Mathf.Min(consonantIntensity, currentVolume * consonantIntensity);
            }
        }
        
        // Detect potential M/B/P sounds (low frequency spikes)
        if (lowFreq > 0.02f && midFreq < lowFreq * 0.3f)
        {
            targetMouthPress = Mathf.Min(mBPIntensity, currentVolume * mBPIntensity);
            targetJawOpen *= 0.3f; // Close jaw for these sounds
        }
    }
    
    private float GetFrequencyRange(int startIndex, int endIndex)
    {
        float sum = 0f;
        for (int i = startIndex; i < endIndex && i < spectrumData.Length; i++)
        {
            sum += spectrumData[i];
        }
        return sum;
    }
    
    private void ApplyLipSyncBlendShapes(SkinnedMeshRenderer smr)
    {
        float deltaTime = Time.deltaTime * smoothness;
        
        // Smoothly interpolate to target weights
        ApplySmoothBlendShape(smr, jawOpenIndex, targetJawOpen, deltaTime);
        ApplySmoothBlendShape(smr, mouthAIndex, targetMouthA, deltaTime);
        ApplySmoothBlendShape(smr, mouthEIndex, targetMouthE, deltaTime);
        ApplySmoothBlendShape(smr, mouthIIndex, targetMouthI, deltaTime);
        ApplySmoothBlendShape(smr, mouthOIndex, targetMouthO, deltaTime);
        ApplySmoothBlendShape(smr, mouthUIndex, targetMouthU, deltaTime);
        ApplySmoothBlendShape(smr, mouthPressIndex, targetMouthPress, deltaTime);
        ApplySmoothBlendShape(smr, mouthPuckerIndex, targetMouthPucker, deltaTime);
    }
    
    private void ApplySmoothBlendShape(SkinnedMeshRenderer smr, int blendShapeIndex, float targetWeight, float deltaTime)
    {
        if (blendShapeIndex >= 0)
        {
            float currentWeight = smr.GetBlendShapeWeight(blendShapeIndex);
            float newWeight = Mathf.Lerp(currentWeight, targetWeight, deltaTime);
            smr.SetBlendShapeWeight(blendShapeIndex, newWeight);
        }
    }
    
    private void ResetMouthBlendShapes(SkinnedMeshRenderer smr)
    {
        int[] indices = { jawOpenIndex, mouthAIndex, mouthEIndex, mouthIIndex, 
                         mouthOIndex, mouthUIndex, mouthPressIndex, mouthPuckerIndex };
        
        foreach (int index in indices)
        {
            if (index >= 0)
            {
                smr.SetBlendShapeWeight(index, 0f);
            }
        }
    }
}

