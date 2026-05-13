using UnityEngine;

public class BasicAudioLipSync : MonoBehaviour
{
    [Header("Audio")]
    public AudioSource audioSource;

    [Header("Face Mesh")]
    public SkinnedMeshRenderer faceRenderer;

    [Header("BlendShape")]
    public string mouthOpenBlendShapeName = "mouthOpen";

    [Range(0f, 100f)]
    public float maxMouthOpen = 75f;

    [Range(1f, 1000f)]
    public float sensitivity = 250f;

    [Range(0.01f, 1f)]
    public float smoothSpeed = 0.15f;

    private int mouthBlendShapeIndex = -1;
    private float[] audioSamples = new float[256];
    private float currentWeight = 0f;

    void Start()
    {
        if (audioSource == null)
        {
            Debug.LogError("BasicAudioLipSync: AudioSource is not assigned.");
            enabled = false;
            return;
        }

        if (faceRenderer == null)
        {
            Debug.LogError("BasicAudioLipSync: Face SkinnedMeshRenderer is not assigned.");
            enabled = false;
            return;
        }

        mouthBlendShapeIndex = faceRenderer.sharedMesh.GetBlendShapeIndex(mouthOpenBlendShapeName);

        if (mouthBlendShapeIndex < 0)
        {
            Debug.LogError($"BasicAudioLipSync: BlendShape '{mouthOpenBlendShapeName}' was not found on {faceRenderer.name}.");
            enabled = false;
            return;
        }
    }

    void Update()
    {
        if (!audioSource.isPlaying)
        {
            currentWeight = Mathf.Lerp(currentWeight, 0f, smoothSpeed);
            faceRenderer.SetBlendShapeWeight(mouthBlendShapeIndex, currentWeight);
            return;
        }

        audioSource.GetOutputData(audioSamples, 0);

        float volume = 0f;

        for (int i = 0; i < audioSamples.Length; i++)
        {
            volume += audioSamples[i] * audioSamples[i];
        }

        volume = Mathf.Sqrt(volume / audioSamples.Length);

        float targetWeight = Mathf.Clamp(volume * sensitivity, 0f, maxMouthOpen);

        currentWeight = Mathf.Lerp(currentWeight, targetWeight, smoothSpeed);

        faceRenderer.SetBlendShapeWeight(mouthBlendShapeIndex, currentWeight);
    }
}