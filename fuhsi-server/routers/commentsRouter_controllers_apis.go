package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context/param"
)

func init() {

    beego.GlobalControllerRouter["github.com/fuhsicloud/fuhsi-next/fuhsi-server/controllers/apis:BuildApi"] = append(beego.GlobalControllerRouter["github.com/fuhsicloud/fuhsi-next/fuhsi-server/controllers/apis:BuildApi"],
        beego.ControllerComments{
            Method: "UpdateInfo",
            Router: `/update-info`,
            AllowHTTPMethods: []string{"put"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/fuhsicloud/fuhsi-next/fuhsi-server/controllers/apis:BuildApi"] = append(beego.GlobalControllerRouter["github.com/fuhsicloud/fuhsi-next/fuhsi-server/controllers/apis:BuildApi"],
        beego.ControllerComments{
            Method: "UploadPackage",
            Router: `/upload-package`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

    beego.GlobalControllerRouter["github.com/fuhsicloud/fuhsi-next/fuhsi-server/controllers/apis:NotifyApi"] = append(beego.GlobalControllerRouter["github.com/fuhsicloud/fuhsi-next/fuhsi-server/controllers/apis:NotifyApi"],
        beego.ControllerComments{
            Method: "Commit",
            Router: `/commit`,
            AllowHTTPMethods: []string{"post"},
            MethodParams: param.Make(),
            Filters: nil,
            Params: nil})

}
