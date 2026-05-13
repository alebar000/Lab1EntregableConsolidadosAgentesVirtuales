using UnityEngine;

public class smile : StateMachineBehaviour
{
    [SerializeField] private float transitionSpeed = 2f;
    
    private int mouthSmileLeftIndex = -1;
    private int mouthSmileRightIndex = -1;
    private int mouthOpenIndex = -1;
    
    private float targetSmileWeight = 40f;
    private float targetMouthOpenWeight = 100f;

    // OnStateEnter is called before OnStateEnter is called on any state inside this state machine
    override public void OnStateEnter(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        SkinnedMeshRenderer smr = animator.GetComponent<SkinnedMeshRenderer>();
        if (smr != null && smr.sharedMesh != null)
        {
            // Cache blend shape indices for performance
            mouthSmileLeftIndex = smr.sharedMesh.GetBlendShapeIndex("mouthSmileLeft");
            mouthSmileRightIndex = smr.sharedMesh.GetBlendShapeIndex("mouthSmileRight");
            mouthOpenIndex = smr.sharedMesh.GetBlendShapeIndex("mouthOpen");
        }
    }

    // OnStateUpdate is called before OnStateUpdate is called on any state inside this state machine
    override public void OnStateUpdate(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        SkinnedMeshRenderer smr = animator.GetComponent<SkinnedMeshRenderer>();
        if (smr != null && smr.sharedMesh != null)
        {
            // Smoothly interpolate blend shape weights
            if (mouthSmileLeftIndex >= 0)
            {
                float currentWeight = smr.GetBlendShapeWeight(mouthSmileLeftIndex);
                float newWeight = Mathf.Lerp(currentWeight, targetSmileWeight, Time.deltaTime * transitionSpeed);
                smr.SetBlendShapeWeight(mouthSmileLeftIndex, newWeight);
            }
            
            if (mouthSmileRightIndex >= 0)
            {
                float currentWeight = smr.GetBlendShapeWeight(mouthSmileRightIndex);
                float newWeight = Mathf.Lerp(currentWeight, targetSmileWeight, Time.deltaTime * transitionSpeed);
                smr.SetBlendShapeWeight(mouthSmileRightIndex, newWeight);
            }
            
            if (mouthOpenIndex >= 0)
            {
                float currentWeight = smr.GetBlendShapeWeight(mouthOpenIndex);
                float newWeight = Mathf.Lerp(currentWeight, targetMouthOpenWeight, Time.deltaTime * transitionSpeed);
                smr.SetBlendShapeWeight(mouthOpenIndex, newWeight);
            }
        }
    }

    // OnStateExit is called before OnStateExit is called on any state inside this state machine
    override public void OnStateExit(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        // Optional: Reset blend shapes when exiting (or let the next state handle it)
        SkinnedMeshRenderer smr = animator.GetComponent<SkinnedMeshRenderer>();
        if (smr != null && smr.sharedMesh != null)
        {
            // You can uncomment these lines if you want to reset to neutral on exit
            // This will create smooth transitions out as well
            if (mouthSmileLeftIndex >= 0)
                smr.SetBlendShapeWeight(mouthSmileLeftIndex, 0f);
            if (mouthSmileRightIndex >= 0)
                smr.SetBlendShapeWeight(mouthSmileRightIndex, 0f);
            if (mouthOpenIndex >= 0)
                smr.SetBlendShapeWeight(mouthOpenIndex, 0f);
        }
    }

    // OnStateMove is called before OnStateMove is called on any state inside this state machine
    //override public void OnStateMove(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    //{
    //    
    //}

    // OnStateIK is called before OnStateIK is called on any state inside this state machine
    //override public void OnStateIK(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    //{
    //    
    //}

    // OnStateMachineEnter is called when entering a state machine via its Entry Node
    //override public void OnStateMachineEnter(Animator animator, int stateMachinePathHash)
    //{
    //    
    //}

    // OnStateMachineExit is called when exiting a state machine via its Exit Node
    //override public void OnStateMachineExit(Animator animator, int stateMachinePathHash)
    //{
    //    
    //}
}
