output "execution_role_arn" {
  description = "ARN of the ECS task execution role"
  value       = aws_iam_role.ecs_task_execution.arn
}

output "ecs_task_role_id" {
  description = "Id of the ECS task role"
  value       = aws_iam_role.ecs_task.id
}

output "ecs_task_role_arn" {
  description = "ARN of the ECS task role (runtime app permissions)"
  value       = aws_iam_role.ecs_task.arn
}

output "rds_proxy_role_id" {
  description = "Id of the ECS task role"
  value       = aws_iam_role.rds_proxy.id
}

output "rds_proxy_role_arn" {
  description = "ARN of the ECS task role (runtime app permissions)"
  value       = aws_iam_role.rds_proxy.arn
}
