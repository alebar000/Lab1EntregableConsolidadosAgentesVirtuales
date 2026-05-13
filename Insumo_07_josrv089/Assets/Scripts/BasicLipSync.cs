using UnityEngine;

public class BasicLipSync : MonoBehaviour
{
    [Header("Audio")]
    public AudioSource audioSource;

    [Header("Face Renderer")]
    public SkinnedMeshRenderer faceRenderer;

    [Header("Blendshape Settings")]
    public string mouthOpenBlendshapeName = "Jaw_Down";
    public float sensitivity = 250f;
    public float smoothing = 8f;

    private int mouthBlendshapeIndex = -1;
    private float[] samples = new float[64];
    private float currentWeight = 0f;

    void Start()
    {
        if (audioSource == null)
        {
            Debug.LogError("AudioSource is not assigned.");
            enabled = false;
            return;
        }

        if (faceRenderer == null)
        {
            Debug.LogError("Face SkinnedMeshRenderer is not assigned.");
            enabled = false;
            return;
        }

        mouthBlendshapeIndex = faceRenderer.sharedMesh.GetBlendShapeIndex(mouthOpenBlendshapeName);

        if (mouthBlendshapeIndex == -1)
        {
            Debug.LogError("Blendshape not found: " + mouthOpenBlendshapeName);
            enabled = false;
        }
    }

    void Update()
    {
        if (!audioSource.isPlaying)
        {
            currentWeight = Mathf.Lerp(currentWeight, 0f, Time.deltaTime * smoothing);
            faceRenderer.SetBlendShapeWeight(mouthBlendshapeIndex, currentWeight);
            return;
        }

        audioSource.GetOutputData(samples, 0);

        float sum = 0f;
        for (int i = 0; i < samples.Length; i++)
        {
            sum += Mathf.Abs(samples[i]);
        }

        float volume = sum / samples.Length;
        float targetWeight = Mathf.Clamp(volume * sensitivity, 0f, 100f);

        currentWeight = Mathf.Lerp(currentWeight, targetWeight, Time.deltaTime * smoothing);

        faceRenderer.SetBlendShapeWeight(mouthBlendshapeIndex, currentWeight);
    }
}