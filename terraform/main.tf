resource "aws_vpc" "this" {
  cidr_block = "10.0.0.0/16"

  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "f1-vpc"
  }
}

resource "aws_subnet" "this" {
  vpc_id     = aws_vpc.this.id
  cidr_block = "10.0.1.0/24"

  map_public_ip_on_launch = true
  availability_zone       = "ap-northeast-2a"
  tags = {
    Name = "f1-subnet-az-a"
  }
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name = "f1-igw"
  }
}

resource "aws_route_table" "this" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }

  tags = {
    Name = "f1-route-table"
  }
}

resource "aws_route_table_association" "this" {
  subnet_id      = aws_subnet.this.id
  route_table_id = aws_route_table.this.id
}

resource "aws_security_group" "this" {
  name   = "f1-sg"
  vpc_id = aws_vpc.this.id

  tags = {
    Name = "f1-security-group"
  }
}

resource "aws_security_group_rule" "ingress" {
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.this.id
}

resource "aws_security_group_rule" "ingress-ssh-house" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = [var.my_house_ip]
  security_group_id = aws_security_group.this.id
}

resource "aws_security_group_rule" "ingress-ssh-office" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = [var.my_office_ip]
  security_group_id = aws_security_group.this.id
}

resource "aws_security_group_rule" "egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.this.id
}

resource "aws_instance" "this" {
  ami             = data.aws_ami.amazon_linux_2023_arm64.id
  instance_type   = "t4g.nano"
  key_name        = "f1_board"
  subnet_id       = aws_subnet.this.id
  security_groups = [aws_security_group.this.id]
  user_data = templatefile("${path.module}/user_data.sh.tftpl", {
    app_directory         = var.app_directory
    repo_url              = var.repo_url
    repo_branch           = var.repo_branch
    frontend_origin       = var.frontend_origin
    frontend_api_url      = var.frontend_api_url
    db_name               = var.db_name
    db_user               = var.db_user
    mariadb_database      = var.mariadb_database
    mariadb_user          = var.mariadb_user
    docker_buildx_version = var.docker_buildx_version
  })

  tags = {
    Name = "f1_board"
  }
}
