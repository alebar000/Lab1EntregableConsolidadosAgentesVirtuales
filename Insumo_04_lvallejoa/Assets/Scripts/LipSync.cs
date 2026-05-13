using UnityEngine;

public class LipSync : MonoBehaviour
{
    private SkinnedMeshRenderer skinnedMesh;
    private AudioSource audioSource;
    public int jawOpenBlendshape = 0;

    void Start()
    {
        skinnedMesh = GetComponentInChildren<SkinnedMeshRenderer>();
        audioSource = GetComponent<AudioSource>();
    }

    void Update()
    {
        if (audioSource != null && audioSource.isPlaying)
        {
            float[] samples = new float[256];
            audioSource.GetOutputData(samples, 0);

            float volume = 0;
            foreach (float s in samples)
                volume += Mathf.Abs(s);

            volume = (volume / samples.Length) * 5000f;;
            volume = Mathf.Clamp(volume, 0, 100);

            skinnedMesh.SetBlendShapeWeight(jawOpenBlendshape, volume);
        }
        else
        {
            skinnedMesh.SetBlendShapeWeight(jawOpenBlendshape, 0);
        }
    }
}