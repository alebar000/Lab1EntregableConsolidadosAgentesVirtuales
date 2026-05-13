using UnityEngine;
using UnityEditor;
using System.Collections.Generic;

public class ModelPolyCounter : EditorWindow
{
    [MenuItem("Tools/Count Selected Model Polygons")]
    public static void CountSelectedModelPolygons()
    {
        GameObject selected = Selection.activeGameObject;

        if (selected == null)
        {
            Debug.LogWarning("No GameObject selected. Please select the root object of the model.");
            return;
        }

        int totalVertices = 0;
        int totalTriangles = 0;

        HashSet<Mesh> countedMeshes = new HashSet<Mesh>();

        MeshFilter[] meshFilters = selected.GetComponentsInChildren<MeshFilter>(true);
        foreach (MeshFilter meshFilter in meshFilters)
        {
            Mesh mesh = meshFilter.sharedMesh;

            if (mesh != null && !countedMeshes.Contains(mesh))
            {
                countedMeshes.Add(mesh);
                totalVertices += mesh.vertexCount;
                totalTriangles += mesh.triangles.Length / 3;
            }
        }

        SkinnedMeshRenderer[] skinnedMeshRenderers = selected.GetComponentsInChildren<SkinnedMeshRenderer>(true);
        foreach (SkinnedMeshRenderer renderer in skinnedMeshRenderers)
        {
            Mesh mesh = renderer.sharedMesh;

            if (mesh != null && !countedMeshes.Contains(mesh))
            {
                countedMeshes.Add(mesh);
                totalVertices += mesh.vertexCount;
                totalTriangles += mesh.triangles.Length / 3;
            }
        }

        Debug.Log($"Model: {selected.name}");
        Debug.Log($"Unique Meshes Counted: {countedMeshes.Count}");
        Debug.Log($"Total Vertices: {totalVertices:N0}");
        Debug.Log($"Total Triangles / Tris: {totalTriangles:N0}");
    }
}