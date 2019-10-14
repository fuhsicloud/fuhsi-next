package vo

import (
    "github.com/astaxie/beego/validation"
    "github.com/fuhsicloud/fuhsi-next/fuhsi-server/entities"
    "github.com/fuhsicloud/fuhsi-next/fuhsi-server/lang"
)

type ReqMember struct {
    Member entities.MemberEntity `json:"member"`
}

func (t *ReqMember) Valid() error {
    valid := validation.Validation{}
    valid.Min(t.Member.ProjectId, 1, "project_id").Message(lang.I("project.id.invalid"))
    valid.Min(t.Member.ProjectRoleId, 1, "project_role_id").Message(lang.I("project_role.id.invalid"))
    valid.Min(t.Member.Uid, 1, "uid").Message(lang.I("project_role.id.invalid"))
    if valid.HasErrors() {
        return valid.Errors[0]
    }

    return nil

}
