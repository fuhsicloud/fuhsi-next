package entities

import "github.com/fuhsicloud/fuhsi-next/fuhsi-server/lang"

// init environments while create app
var InitEnvs = []string{
    lang.I("env.dev"),
    lang.I("env.test"),
    lang.I("env.staging"),
    lang.I("env.prod"),
}

type EnvEntity struct {
    BaseEntity

    AppId          int64  `json:"app_id"`
    Uid            int64  `json:"uid"`
    Name           string `json:"name"`
    PermitBranches string `json:"permit_branches"`
    IsAutoDeploy   bool   `json:"is_auto_deploy"`
    IsNeedAudit    bool   `json:"is_need_audit"`
    CmdEnv         string `json:"cmd_env"`
}
