using UnityEngine;
using UnityEngine.InputSystem;

public class LewisController : MonoBehaviour
{
    private Animator animator;

    void Start()
    {
        animator = GetComponent<Animator>();
    }

    void Update()
    {
        if (Keyboard.current.wKey.wasPressedThisFrame)
        {
            animator.SetTrigger("DoWave");
        }

        if (Keyboard.current.eKey.wasPressedThisFrame)
        {
            animator.SetTrigger("DoPoint");
        }
    }
}