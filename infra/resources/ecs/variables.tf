variable "name_prefix" {
  type = string
}

variable "ecs_task_role_arn" {
  type = string
}

variable "ecs_execution_role_arn" {
  type = string
}

variable "ecs_web_image" {
  type = string
}

variable "ecs_api_image" {
  type = string
}

variable "web_port" {
  type    = number
}

variable "api_port" {
  type    = number
}

variable "db_port" {
  type    = number
  default = 5432
}

variable "ecs_web_desired_count" {
  type    = number
  default = 1
}

variable "ecs_api_desired_count" {
  type    = number
  default = 1
}

variable "ecs_subnet_ids" {
  type = list(string)
}

variable "ecs_web_sg_ids" {
  type = list(string)
}

variable "ecs_api_sg_ids" {
  type = list(string)
}

variable "target_group_web_arn" {
  type = string
}

variable "target_group_api_arn" {
  type = string
}

variable "rds_proxy_endpoint" {
  type = string
}

variable "redis_client_url" {
  type = string
}

variable "db_user" {
  type = string
}

variable "db_name" {
  type = string
}

variable "google_redirect_uri" {
  type = string
}

variable "web_app_url" {
  type = string
}

variable "secret_manager_arn" {
  type = string
}