using UnityEngine;

public class thinking : StateMachineBehaviour
{
    [SerializeField] private float transitionSpeed = 2f;
    [SerializeField] private float browFurrowIntensity = 60f;
    [SerializeField] private float eyeSquintIntensity = 25f;
    [SerializeField] private float mouthPurseIntensity = 30f;
    [SerializeField] private float eyeLookUpIntensity = 40f;
    
    // Cached blend shape indices
    private int browDownLeftIndex = -1;
    private int browDownRightIndex = -1;
    private int eyeSquintLeftIndex = -1;
    private int eyeSquintRightIndex = -1;
    private int eyeLookUpLeftIndex = -1;
    private int eyeLookUpRightIndex = -1;
    private int mouthPurseIndex = -1;
    private int mouthFunnelIndex = -1;

    // OnStateEnter is called when a transition starts and the state machine starts to evaluate this state
    override public void OnStateEnter(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        SkinnedMeshRenderer smr = animator.GetComponent<SkinnedMeshRenderer>();
        if (smr != null && smr.sharedMesh != null)
        {
            // Cache blend shape indices for brow furrow
            browDownLeftIndex = smr.sharedMesh.GetBlendShapeIndex("browDownLeft");
            browDownRightIndex = smr.sharedMesh.GetBlendShapeIndex("browDownRight");
            
            // Try alternative names if not found
            if (browDownLeftIndex < 0)
                browDownLeftIndex = smr.sharedMesh.GetBlendShapeIndex("BrowDown_Left");
            if (browDownRightIndex < 0)
                browDownRightIndex = smr.sharedMesh.GetBlendShapeIndex("BrowDown_Right");
            
            // Cache eye squint indices
            eyeSquintLeftIndex = smr.sharedMesh.GetBlendShapeIndex("eyeSquintLeft");
            eyeSquintRightIndex = smr.sharedMesh.GetBlendShapeIndex("eyeSquintRight");
            
            if (eyeSquintLeftIndex < 0)
                eyeSquintLeftIndex = smr.sharedMesh.GetBlendShapeIndex("Squint_Left");
            if (eyeSquintRightIndex < 0)
                eyeSquintRightIndex = smr.sharedMesh.GetBlendShapeIndex("Squint_Right");
            
            // Cache eye look up indices
            eyeLookUpLeftIndex = smr.sharedMesh.GetBlendShapeIndex("eyeLookUpLeft");
            eyeLookUpRightIndex = smr.sharedMesh.GetBlendShapeIndex("eyeLookUpRight");
            
            if (eyeLookUpLeftIndex < 0)
                eyeLookUpLeftIndex = smr.sharedMesh.GetBlendShapeIndex("EyeUp_Left");
            if (eyeLookUpRightIndex < 0)
                eyeLookUpRightIndex = smr.sharedMesh.GetBlendShapeIndex("EyeUp_Right");
            
            // Cache mouth indices for pursed/thinking expression
            mouthPurseIndex = smr.sharedMesh.GetBlendShapeIndex("mouthPucker");
            if (mouthPurseIndex < 0)
                mouthPurseIndex = smr.sharedMesh.GetBlendShapeIndex("mouthFunnel");
            if (mouthPurseIndex < 0)
                mouthPurseIndex = smr.sharedMesh.GetBlendShapeIndex("MouthPucker");
                
            mouthFunnelIndex = smr.sharedMesh.GetBlendShapeIndex("mouthFunnel");
            if (mouthFunnelIndex < 0)
                mouthFunnelIndex = smr.sharedMesh.GetBlendShapeIndex("MouthFunnel");
        }
    }

    // OnStateUpdate is called on each Update frame between OnStateEnter and OnStateExit callbacks
    override public void OnStateUpdate(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        SkinnedMeshRenderer smr = animator.GetComponent<SkinnedMeshRenderer>();
        if (smr != null && smr.sharedMesh != null)
        {
            float deltaTime = Time.deltaTime * transitionSpeed;
            
            // Apply brow furrow for concentration
            ApplySmoothBlendShape(smr, browDownLeftIndex, browFurrowIntensity, deltaTime);
            ApplySmoothBlendShape(smr, browDownRightIndex, browFurrowIntensity, deltaTime);
            
            // Apply subtle eye squint for focus
            ApplySmoothBlendShape(smr, eyeSquintLeftIndex, eyeSquintIntensity, deltaTime);
            ApplySmoothBlendShape(smr, eyeSquintRightIndex, eyeSquintIntensity, deltaTime);
            
            // Apply eyes looking up (thinking pose)
            ApplySmoothBlendShape(smr, eyeLookUpLeftIndex, eyeLookUpIntensity, deltaTime);
            ApplySmoothBlendShape(smr, eyeLookUpRightIndex, eyeLookUpIntensity, deltaTime);
            
            // Apply mouth purse for thinking expression
            ApplySmoothBlendShape(smr, mouthPurseIndex, mouthPurseIntensity, deltaTime);
            
            // Optional: slight mouth funnel for more pronounced thinking look
            ApplySmoothBlendShape(smr, mouthFunnelIndex, mouthPurseIntensity * 0.5f, deltaTime);
        }
    }

    // OnStateExit is called when a transition ends and the state machine finishes evaluating this state
    override public void OnStateExit(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        SkinnedMeshRenderer smr = animator.GetComponent<SkinnedMeshRenderer>();
        if (smr != null && smr.sharedMesh != null)
        {
            // Smooth transition out by setting target weights to 0
            // The actual reset will happen gradually through the transition
            // You can uncomment these for immediate reset if needed:
            ResetBlendShape(smr, browDownLeftIndex);
            ResetBlendShape(smr, browDownRightIndex);
            ResetBlendShape(smr, eyeSquintLeftIndex);
            ResetBlendShape(smr, eyeSquintRightIndex);
            ResetBlendShape(smr, eyeLookUpLeftIndex);
            ResetBlendShape(smr, eyeLookUpRightIndex);
            ResetBlendShape(smr, mouthPurseIndex);
            ResetBlendShape(smr, mouthFunnelIndex);
        }
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
    
    private void ResetBlendShape(SkinnedMeshRenderer smr, int blendShapeIndex)
    {
        if (blendShapeIndex >= 0)
        {
            smr.SetBlendShapeWeight(blendShapeIndex, 0f);
        }
    }

    // OnStateMove is called right after Animator.OnAnimatorMove()
    //override public void OnStateMove(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    //{
    //    // Implement code that processes and affects root motion
    //}

    // OnStateIK is called right after Animator.OnAnimatorIK()
    //override public void OnStateIK(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    //{
    //    // Implement code that sets up animation IK (inverse kinematics)
    //}
}
