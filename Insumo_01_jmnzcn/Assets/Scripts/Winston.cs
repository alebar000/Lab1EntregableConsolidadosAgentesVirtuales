using UnityEngine;

public class Winston : MonoBehaviour
{
    [SerializeField] Animator animator_facial;
    [SerializeField] Animator animator_fisica;

    [SerializeField] GameObject camara;
    [SerializeField] Vector3 pos1Camara;
    [SerializeField] Vector3 pos2Camara;

    [SerializeField] AudioClip voz_holaComoEstas;
    [SerializeField] AudioSource audioSource;


    //Animaciones y expresiones
    public void ExpresionAlegria()
    {
        ExpresionNeutral();
        animator_facial.SetBool("Alegria", true);
    }

    public void ExpresionTristeza()
    {
        ExpresionNeutral();
        animator_facial.SetBool("Tristeza", true);
    }

    public void ExpresionDuda()
    {
        ExpresionNeutral();
        animator_facial.SetBool("Duda", true);
    }

    public void ExpresionNeutral()
    {
        animator_facial.SetBool("Alegria", false);
        animator_facial.SetBool("Tristeza", false);
        animator_facial.SetBool("Duda", false);

    }

    //Animaciones fisicas

    public void Idle()
    {
        ReiniciarAnimacionesFisicas();
        animator_fisica.SetBool("Idle", true);
    }

    public void Pelear()
    {
        ReiniciarAnimacionesFisicas();
        animator_fisica.SetTrigger("Pelear");
    }

    public void Bailar()
    {
        ReiniciarAnimacionesFisicas();
        animator_fisica.SetTrigger("Bailar");
    }
    public void DeAcuerdo()
    {
        ReiniciarAnimacionesFisicas();
        animator_fisica.SetTrigger("DeAcuerdo");
    }

    public void ReiniciarAnimacionesFisicas()
    {
        animator_fisica.SetBool("Idle", false);
        animator_fisica.SetBool("Pelear", false);
        animator_fisica.SetBool("Bailar", false);
    }

    public void Hablar()
    {
        ExpresionNeutral();
        ReiniciarAnimacionesFisicas();

        audioSource.PlayOneShot(voz_holaComoEstas); //Sonido
        animator_facial.SetTrigger("Voz"); //Animacion facial
    }

    //Posicionar camaras
    public void Cam1()
    {
        camara.transform.position = pos1Camara;
    }
    public void Cam2()
    {
        camara.transform.position = pos2Camara;
    }
}
