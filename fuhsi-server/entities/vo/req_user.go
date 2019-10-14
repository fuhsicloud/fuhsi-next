package vo

import "github.com/fuhsicloud/fuhsi-next/fuhsi-server/entities"

type ReqUser struct {
	User entities.UserEntity `json:"user"`
}
