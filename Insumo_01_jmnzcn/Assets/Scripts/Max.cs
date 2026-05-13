using UnityEngine;

public class Max : MonoBehaviour
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
    public void PushUps()
    {
        ReiniciarAnimacionesFisicas();
        animator_fisica.SetTrigger("PushUp");
    }

    public void Saludar()
    {
        ReiniciarAnimacionesFisicas();
        animator_fisica.SetTrigger("Saludar");
    }
    public void Burpee()
    {
        ReiniciarAnimacionesFisicas();
        animator_fisica.SetTrigger("Burpee");
    }

    public void QuedarseQuieto()
    {
        ReiniciarAnimacionesFisicas();
        animator_fisica.SetBool("Quieto", true);
    }

    public void Idle()
    {
        ReiniciarAnimacionesFisicas();
        animator_fisica.SetBool("Idle", true);
    }

    public void ReiniciarAnimacionesFisicas()
    {
        animator_fisica.SetBool("Idle", false);
        animator_fisica.SetBool("Saludar", false);
        animator_fisica.SetBool("Quieto", false);
        animator_fisica.SetBool("PushUp", false);
    }


    //Voz
    public void Hablar()
    {
        ExpresionNeutral();
        QuedarseQuieto();

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
