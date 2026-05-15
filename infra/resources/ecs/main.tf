data "aws_region" "current" { }

resource "aws_ecs_cluster" "ecs-cluster" {
  name = "${var.name_prefix}-ecs-cluster"
}

resource "aws_ecs_task_definition" "web" {
  family = "web-service"

  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu = 1024
  memory = 2048

  execution_role_arn = var.ecs_execution_role_arn

  container_definitions = jsonencode([
    {
        name = "web-container"
        image = var.ecs_web_image
        cpu = 10
        memory = 512
        portMappings = [
            {
                containerPort = var.web_port
                hostPort = var.web_port
            }
        ]
        environment = [

        ]
        essential = true
        logConfiguration = {
            logDriver =  "awslogs",
            options =  {
                "awslogs-group" =  "/ecs/web",
                "awslogs-region" =  data.aws_region.current.region,
                "awslogs-stream-prefix" =  "web"
            }
        }
    }
  ])

  runtime_platform {
    cpu_architecture        = "X86_64"
    operating_system_family = "LINUX"
  }

  depends_on = [ aws_cloudwatch_log_group.web ]
}

resource "aws_ecs_service" "web" {
  name = "${var.name_prefix}-ecs-web-service"

  cluster = aws_ecs_cluster.ecs-cluster.id
  
  desired_count = var.ecs_web_desired_count
  
  launch_type = "FARGATE"
  scheduling_strategy = "REPLICA"

  network_configuration {
    assign_public_ip = false
    subnets = var.ecs_subnet_ids
    security_groups = var.ecs_web_sg_ids
  }

  load_balancer {
    target_group_arn = var.target_group_web_arn
    container_name = "web-container"
    container_port = var.web_port
  }
}

resource "aws_ecs_task_definition" "api" {
  family = "api-service"

  requires_compatibilities = ["FARGATE"]
  network_mode = "awsvpc"
  cpu = 1024
  memory = 2048

  task_role_arn = var.ecs_task_role_arn
  execution_role_arn = var.ecs_execution_role_arn

  container_definitions = jsonencode([
    {
        name = "api-container"
        image = var.ecs_api_image
        cpu = 10
        memory = 512
        portMappings = [
            {
                containerPort = var.api_port
                hostPort = var.api_port
            }
        ]
        environment = [

        ]
        essential = true
        logConfiguration = {
            logDriver =  "awslogs",
            options =  {
                "awslogs-group" =  "/ecs/api",
                "awslogs-region" =  data.aws_region.current.region,
                "awslogs-stream-prefix" =  "api"
            }
        }
    }
  ])

  runtime_platform {
    cpu_architecture        = "X86_64"
    operating_system_family = "LINUX"
  }

  depends_on = [ aws_cloudwatch_log_group.api ]
}

resource "aws_ecs_service" "api" {
  name = "${var.name_prefix}-ecs-api-service"

  cluster = aws_ecs_cluster.ecs-cluster.id
  task_definition = aws_ecs_task_definition.api.id

  desired_count = var.ecs_api_desired_count

  launch_type = "FARGATE"
  scheduling_strategy = "REPLICA"

  network_configuration {
    assign_public_ip = false
    subnets = var.ecs_subnet_ids
    security_groups = var.ecs_api_sg_ids
  }

  load_balancer {
    target_group_arn = var.target_group_api_arn
    container_name = "api-container"
    container_port =  var.api_port
  }
}

resource "aws_cloudwatch_log_group" "web" {
  name = "/ecs/web"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "api" {
  name = "/ecs/api"
  retention_in_days = 30
}