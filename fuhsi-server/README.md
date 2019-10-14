go mod init
go mod tidy
go build -o fuhsi-server main.go
go build -ldflags "-s -w" -o fuhsi-server -mod=vendor main.go

# 启用 Go Modules 功能
$env:GO111MODULE="on"
# 配置 GOPROXY 环境变量
$env:GOPROXY="https://goproxy.io"

