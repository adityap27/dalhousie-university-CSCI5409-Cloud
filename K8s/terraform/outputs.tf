output "project_id" {
  value       = var.project_id
  description = "GCloud Project ID"
}

output "location" {
  value       = var.location
  description = "GCloud Zone of k8s cluster"
}

output "k8s_cluster_name" {
  value       = google_container_cluster.k8s-assignment-cluster-1.name
  description = "GKE Cluster Name"
}

output "kubernetes_cluster_host" {
  value       = google_container_cluster.k8s-assignment-cluster-1.endpoint
  description = "GKE Cluster Host"
}