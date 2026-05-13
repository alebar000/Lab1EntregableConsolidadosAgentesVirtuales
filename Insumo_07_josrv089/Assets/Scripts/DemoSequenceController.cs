using System.Collections;
using UnityEngine;

public class DemoSequenceController : MonoBehaviour
{
    [Header("Model 1 - Mike Alger")]
    public GameObject model1;
    public AudioSource model1Audio;
    public Animator model1Animator;
    public string model1IdleStateName = "Idle";

    [Header("Model 2 - VRoid")]
    public GameObject model2;
    public AudioSource model2Audio;
    public Animator model2Animator;

    [Header("Timing")]
    public float delayBeforeStart = 1f;
    public float delayBetweenModels = 1f;
    public bool hideFirstModelWhenSecondStarts = false;

    private IEnumerator Start()
    {
        if (model1 == null || model2 == null)
        {
            Debug.LogError("DemoSequenceController: Assign both models.");
            yield break;
        }

        if (model1Audio == null || model2Audio == null)
        {
            Debug.LogError("DemoSequenceController: Assign both AudioSources.");
            yield break;
        }

        // Estado inicial
        model1.SetActive(true);
        model2.SetActive(false);

        yield return new WaitForSeconds(delayBeforeStart);

        // Inicia Mike
        StartAnimator(model1Animator);
        model1Audio.Play();

        // Espera a que Mike termine de hablar
        yield return new WaitWhile(() => model1Audio.isPlaying);

        // En vez de congelarlo en pose rara, lo manda a Idle
        PlayIdle(model1Animator, model1IdleStateName);

        yield return new WaitForSeconds(delayBetweenModels);

        if (hideFirstModelWhenSecondStarts)
        {
            model1.SetActive(false);
        }

        // Inicia el segundo avatar
        model2.SetActive(true);
        StartAnimator(model2Animator);
        model2Audio.Play();

        yield return new WaitWhile(() => model2Audio.isPlaying);

        // Opcional: dejar a la segunda avatar en su última pose o luego crearle también un Idle
        // StopAnimator(model2Animator);
    }

    private void StartAnimator(Animator animator)
    {
        if (animator == null)
        {
            return;
        }

        animator.speed = 1f;
        animator.Rebind();
        animator.Update(0f);
    }

    private void PlayIdle(Animator animator, string idleStateName)
    {
        if (animator == null)
        {
            return;
        }

        animator.speed = 1f;
        animator.CrossFade(idleStateName, 0.25f);
    }

    private void StopAnimator(Animator animator)
    {
        if (animator == null)
        {
            return;
        }

        animator.speed = 0f;
    }
}