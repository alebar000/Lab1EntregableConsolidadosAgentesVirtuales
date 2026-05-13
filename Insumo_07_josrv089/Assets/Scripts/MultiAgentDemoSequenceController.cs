using System.Collections;
using UnityEngine;

public class MultiAgentDemoSequenceController : MonoBehaviour
{
    [System.Serializable]
    public class AgentDemoStep
    {
        [Header("Agent")]
        public string agentName;
        public GameObject agentObject;
        public Animator animator;
        public AudioSource audioSource;

        [Header("Animator State Names")]
        public string greetingStateName = "Greeting";
        public string speakingStateName = "SpeakingLoop";
        public string idleStateName = "Idle";

        [Header("Timing")]
        public bool playGreetingBeforeSpeaking = true;
        public float greetingDuration = 2f;
        public float delayAfterSpeaking = 0.75f;

        [Header("Visibility / Final State")]
        public bool showAgentAtStart = true;
        public bool hideAgentAfterFinished = false;
        public bool freezeAnimatorAfterFinished = false;
        public float freezeAfterIdleDelay = 0.25f;
    }

    [Header("Demo Sequence")]
    public AgentDemoStep[] agents;

    [Header("Global Timing")]
    public float delayBeforeStart = 1f;
    public float delayBetweenAgents = 1f;

    private IEnumerator Start()
    {
        HideAllAgents();

        yield return new WaitForSeconds(delayBeforeStart);

        foreach (AgentDemoStep step in agents)
        {
            if (!IsValidStep(step))
            {
                continue;
            }

            yield return RunAgentStep(step);

            yield return new WaitForSeconds(delayBetweenAgents);
        }
    }

    private IEnumerator RunAgentStep(AgentDemoStep step)
    {
        if (step.showAgentAtStart)
        {
            step.agentObject.SetActive(true);
        }

        ResetAnimator(step.animator);

        if (step.playGreetingBeforeSpeaking && !string.IsNullOrWhiteSpace(step.greetingStateName))
        {
            PlayState(step.animator, step.greetingStateName, 0.15f);
            yield return new WaitForSeconds(step.greetingDuration);
        }

        PlayState(step.animator, step.speakingStateName, 0.15f);

        step.audioSource.Stop();
        step.audioSource.Play();

        while (step.audioSource.isPlaying)
        {
            yield return null;
        }

        // Cuando termina el audio, pasa a Idle.
        PlayState(step.animator, step.idleStateName, 0.25f);

        yield return new WaitForSeconds(step.freezeAfterIdleDelay);

        // Si se desea, congela el animator después de entrar a Idle.
        if (step.freezeAnimatorAfterFinished)
        {
            step.animator.speed = 0f;
        }

        yield return new WaitForSeconds(step.delayAfterSpeaking);

        if (step.hideAgentAfterFinished)
        {
            step.agentObject.SetActive(false);
        }
    }

    private void HideAllAgents()
    {
        if (agents == null)
        {
            return;
        }

        foreach (AgentDemoStep step in agents)
        {
            if (step != null && step.agentObject != null)
            {
                step.agentObject.SetActive(false);
            }
        }
    }

    private bool IsValidStep(AgentDemoStep step)
    {
        if (step == null)
        {
            Debug.LogWarning("Demo step is null.");
            return false;
        }

        if (step.agentObject == null)
        {
            Debug.LogWarning("Missing agent object in demo step: " + step.agentName);
            return false;
        }

        if (step.animator == null)
        {
            Debug.LogWarning("Missing animator in demo step: " + step.agentName);
            return false;
        }

        if (step.audioSource == null)
        {
            Debug.LogWarning("Missing audio source in demo step: " + step.agentName);
            return false;
        }

        return true;
    }

    private void ResetAnimator(Animator animator)
    {
        animator.speed = 1f;
        animator.Rebind();
        animator.Update(0f);
    }

    private void PlayState(Animator animator, string stateName, float transitionDuration)
    {
        animator.speed = 1f;
        animator.CrossFade(stateName, transitionDuration);
    }
}