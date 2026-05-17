variable "my_house_ip" {
  description = "My house public IP address for SSH access"
  type        = string
}

variable "my_office_ip" {
  description = "My office public IP address for SSH access"
  type        = string
}

variable "repo_url" {
  description = "Git repository URL cloned during EC2 bootstrap"
  type        = string
  default     = "https://github.com/J4EU/Cloud-Native-F1-Board"
}

variable "repo_branch" {
  description = "Git branch checked out during EC2 bootstrap"
  type        = string
  default     = "main"
}

variable "app_directory" {
  description = "Directory where the application repository is cloned"
  type        = string
  default     = "/home/ec2-user/app"
}

variable "frontend_origin" {
  description = "Allowed frontend origin for backend CORS. Leave empty to use the instance public IP."
  type        = string
  default     = ""
}

variable "frontend_api_url" {
  description = "Frontend API base URL injected into frontend/.env"
  type        = string
  default     = "/api"
}

variable "db_name" {
  description = "Backend database name"
  type        = string
  default     = "f1db"
}

variable "db_user" {
  description = "Backend database user"
  type        = string
  default     = "f1user"
}

variable "mariadb_database" {
  description = "Database created by the MariaDB container on first boot"
  type        = string
  default     = "f1db"
}

variable "mariadb_user" {
  description = "MariaDB application user"
  type        = string
  default     = "f1user"
}

variable "docker_buildx_version" {
  description = "Docker Buildx version installed during EC2 bootstrap"
  type        = string
  default     = "v0.17.1"
}
