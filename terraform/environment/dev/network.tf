resource "aws_vpc" "this" {
  cidr_block = "10.1.0.0/20"

  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "dev-f1-board-vpc"
  }
}

resource "aws_subnet" "public_sn_a" {
  vpc_id            = aws_vpc.this.id
  cidr_block        = "10.1.0.0/24"
  availability_zone = "ap-northeast-2a"

  map_public_ip_on_launch = true

  tags = {
    Name = "dev-f1-board-public-sn-a"
  }
}

resource "aws_subnet" "public_sn_c" {
  vpc_id            = aws_vpc.this.id
  cidr_block        = "10.1.1.0/24"
  availability_zone = "ap-northeast-2c"

  map_public_ip_on_launch = true

  tags = {
    Name = "dev-f1-board-public-sn-c"
  }
}

resource "aws_subnet" "private_sn_was_a" {
  vpc_id            = aws_vpc.this.id
  cidr_block        = "10.1.4.0/22"
  availability_zone = "ap-northeast-2a"

  map_public_ip_on_launch = false

  tags = {
    Name = "dev-f1-board-private-sn-was-a"
  }
}

resource "aws_subnet" "private_sn_was_c" {
  vpc_id            = aws_vpc.this.id
  cidr_block        = "10.1.8.0/22"
  availability_zone = "ap-northeast-2c"

  map_public_ip_on_launch = false

  tags = {
    Name = "dev-f1-board-private-sn-was-c"
  }
}

resource "aws_subnet" "private_sn_rds_a" {
  vpc_id            = aws_vpc.this.id
  cidr_block        = "10.1.14.0/24"
  availability_zone = "ap-northeast-2a"

  map_public_ip_on_launch = false

  tags = {
    Name = "dev-f1-board-private-sn-rds-a"
  }
}

resource "aws_subnet" "private_sn_rds_c" {
  vpc_id            = aws_vpc.this.id
  cidr_block        = "10.1.15.0/24"
  availability_zone = "ap-northeast-2c"

  map_public_ip_on_launch = false

  tags = {
    Name = "dev-f1-board-private-sn-rds-c"
  }
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name = "dev-f1-board-igw"
  }
}

resource "aws_eip" "nat_a" {
  domain = "vpc"

  tags = {
    Name = "dev-f1-board-nat-eip-a"
  }
}

# 개발 환경: NAT Gateway AZ-a에만 생성
resource "aws_nat_gateway" "nat_a" {
  subnet_id     = aws_subnet.public_sn_a.id
  allocation_id = aws_eip.nat_a.id

  tags = {
    Name = "dev-f1-board-nat-gateway-a"
  }
}

# NAT Gateway AZ-c에는 생성하지 않음
# resource "aws_nat_gateway" "nat_c" {
#   subnet_id     = aws_subnet.public_sn_c.id
#   allocation_id = aws_eip.nat_c.id

#   tags = {
#     Name = "dev-f1-board-nat-gateway-c"
#   }
# }

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }

  tags = {
    Name = "dev-f1-board-public-rt"
  }
}

resource "aws_route_table_association" "public_rt_assoc_a" {
  subnet_id      = aws_subnet.public_sn_a.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_rt_assoc_c" {
  subnet_id      = aws_subnet.public_sn_c.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table" "private_rt_was_a" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name = "dev-f1-board-private-rt-was-a"
  }
}

resource "aws_route_table" "private_rt_was_c" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name = "dev-f1-board-private-rt-was-c"
  }
}

resource "aws_route_table_association" "private_rt_was_assoc_a" {
  subnet_id      = aws_subnet.private_sn_was_a.id
  route_table_id = aws_route_table.private_rt_was_a.id
}

resource "aws_route_table_association" "private_rt_was_assoc_c" {
  subnet_id      = aws_subnet.private_sn_was_c.id
  route_table_id = aws_route_table.private_rt_was_c.id
}

resource "aws_route" "private_rt_was_route_a" {
  route_table_id         = aws_route_table.private_rt_was_a.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.nat_a.id
}

# resource "aws_route" "private_rt_was_route_c" {
#   route_table_id         = aws_route_table.private_rt_was_c.id
#   destination_cidr_block = "0.0.0.0/0"
#   nat_gateway_id         = aws_nat_gateway.nat_c.id
# }

resource "aws_route_table" "private_rt_rds_a" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name = "dev-f1-board-private-rt-rds-a"
  }
}

resource "aws_route_table" "private_rt_rds_c" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name = "dev-f1-board-private-rt-rds-c"
  }
}

resource "aws_route_table_association" "private_rt_rds_assoc_a" {
  subnet_id      = aws_subnet.private_sn_rds_a.id
  route_table_id = aws_route_table.private_rt_rds_a.id
}

resource "aws_route_table_association" "private_rt_rds_assoc_c" {
  subnet_id      = aws_subnet.private_sn_rds_c.id
  route_table_id = aws_route_table.private_rt_rds_c.id
}
