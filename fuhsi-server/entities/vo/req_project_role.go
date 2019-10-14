package vo

import (
    "github.com/fuhsicloud/fuhsi-next/fuhsi-server/entities"
    "github.com/fuhsicloud/fuhsi-next/fuhsi-server/lang"
    "github.com/astaxie/beego/validation"
)

type ReqProjectRole struct {
    ProjectRole entities.ProjectRoleEntity `json:"project_role"`
}

func (t *ReqProjectRole) Valid(valid validation.Validation) error {
    valid.Required(t.ProjectRole.Name, "name").Message(lang.I("project_role.name.not.empty"))
    if valid.HasErrors() {
        return valid.Errors[0]
    }

    return nil
}
