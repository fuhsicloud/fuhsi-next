<template>
  <page-layout :title="serviceDetail.ServiceName" logo="/clusterlogo.png" :tabs="tabs">
    <!-- actions -->
    <template slot="action">
      <a-button-group style="margin-right: 4px;">
        <a-button icon="caret-right" @click="optionServiceHanlder(1)">启动</a-button>
        <a-button icon="pause-circle" @click="optionServiceHanlder(2)">停止</a-button>
        <a-button icon="thunderbolt" @click="optionServiceHanlder(3)">重启</a-button>
      </a-button-group>
    </template>

    <!-- 操作 -->
    <a-card
      style="margin-top: 24px"
      :bordered="false"
    >
      <a-table
        v-if="activeTabKey === '1'"
        rowKey="ContainerId"
        :columns="operationColumns"
        :dataSource="appContainers"
        :pagination="false"
      >
        <template
          slot="status"
          slot-scope="status">
          <a-badge :status="status | statusTypeFilter" :text="status | statusFilter"/>
        </template>
        <template
          slot="containerId"
          slot-scope="text,record">
          <a><a-icon type="code" style="font-size:20px" @click="handleShowWebtty(record.ContainerId)"></a-icon></a>
        </template>
      </a-table>
      <div v-if="activeTabKey === '2'">
        <template>
          <a-form :form="form" hideRequiredMark>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="集群名称"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-input v-model="clusterName" disabled/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="服务名称"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-input v-model="serviceName" disabled/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="当前实例"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-input v-model="replicas"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="扩展到"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-slider v-model="replicas" :defaultValue="replicas" :max="replicasMax" :min="replicasMin">
                  </a-slider></a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item :wrapper-col="{ span: 12, offset: 3 }">
                  <a-button type="primary" html-type="submit" @click="flexHandler">
                    保存
                  </a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </template>
      </div>
      <div v-if="activeTabKey === '3'">
        <template>
          <a-form :form="form" hideRequiredMark>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="集群名称"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-input v-model="clusterName" disabled/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="服务名称"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-input v-model="serviceName" disabled/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="实例配置"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
                >
                  <a-radio-group v-model="instanceConfig" buttonStyle="solid">
                    <a-radio-button :value="item.id" v-for="item in instanceConfigArra" :key="item.id">{{ item.title }}-{{ item.cpu }}Core/{{ item.mem }}G</a-radio-button>
                  </a-radio-group>
                  <a-row v-if="instanceConfig==='g'">
                    <a-col :span="4">CPU使用量:</a-col>
                    <a-col :span="5"><a-input v-model="chooseCpu" /></a-col>
                    <a-col :span="2" style="padding-left:1%">核</a-col>
                  </a-row>
                  <a-row v-if="instanceConfig==='g'">
                    <a-col :span="4">服务内存使用量:</a-col>
                    <a-col :span="5"><a-input v-model="chooseMem" /></a-col>
                    <a-col :span="2" style="padding-left:1%">M</a-col>
                  </a-row>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item :wrapper-col="{ span: 12, offset: 3 }">
                  <a-button type="primary" html-type="submit" @click="serviceUpgrade('config')">
                    保存
                  </a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </template>
      </div>
      <div v-if="activeTabKey === '4'">
        <template>
          <a-form :form="form" hideRequiredMark>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="集群名称"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-input v-model="clusterName" disabled/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="服务名称"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-input v-model="serviceName" disabled/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="当前镜像"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-input v-model="imageTag" disabled/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="升级到版本"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-input v-model="nowTag"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="版本选择"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-select showSearch allowClear v-model="updateTag">
                    <a-select-option v-for="item in imageTagArra" :key="item" :value="item">{{ item }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="升级间隔"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-input v-model="timeSpace"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item :wrapper-col="{ span: 12, offset: 3 }">
                  <a-button type="primary" html-type="submit" @click="serviceUpgrade('image')">
                    保存
                  </a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </template>
      </div>
      <div v-if="activeTabKey === '5'">
        <template>
          <a-form :form="form" hideRequiredMark>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="集群名称"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-input v-model="clusterName" disabled/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="服务名称"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-input v-model="serviceName" disabled/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="环境变量"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-textarea placeholder="环境变量" :rows="8" v-model="envs"/>
                  </a-textarea></a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item :wrapper-col="{ span: 12, offset: 3 }">
                  <a-button type="primary" html-type="submit" @click="serviceUpgrade('env')">
                    保存
                  </a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </template>
      </div>
      <div v-if="activeTabKey === '6'">
        <template>
          <a-form :form="form" hideRequiredMark>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="集群名称"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-input v-model="clusterName" disabled/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="服务名称"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-input v-model="serviceName" disabled/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="hostNetwork"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-checkbox></a-checkbox>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="容器暴露端口"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <div>
                    <template v-for="(port, index) in ports">
                      <a-tooltip v-if="port.length > 20" :key="port" :title="port">
                        <a-tag :key="port" :closable="index !== -1" :afterClose="() => handleClose(port)" color="blue">
                          {{ `${port.slice(0, 20)}...` }}
                        </a-tag>
                      </a-tooltip>
                      <a-tag v-else :key="port" :closable="index !== -1" :afterClose="() => handleClose(port)" color="blue">
                        {{ port }}
                      </a-tag>
                    </template>
                    <a-input
                      v-if="inputVisible"
                      ref="input"
                      type="text"
                      size="small"
                      :style="{ width: '78px' }"
                      :value="inputValue"
                      @change="handleInputChange"
                      @blur="handleInputConfirm"
                      @keyup.enter="handleInputConfirm"
                    />
                    <a-tag v-else @click="showInput" style="background: #fff; borderStyle: dashed;">
                      <a-icon type="plus" /> New Port
                    </a-tag>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item :wrapper-col="{ span: 12, offset: 3 }">
                  <a-button type="primary" html-type="submit" @click="serviceUpgrade('port')">
                    保存
                  </a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </template>
      </div>
      <div v-if="activeTabKey === '7'">
        <template>
          <a-form :form="form" hideRequiredMark>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="检查类型"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
                >
                  <a-radio-group buttonStyle="solid" v-model="healthType">
                    <a-radio-button value="HTTP">HTTP</a-radio-button>
                    <a-radio-button value="TCP">TCP</a-radio-button>
                    <a-radio-button value="CMD">CMD</a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="端口"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
                  v-if="healthType==='HTTP' || healthType==='TCP'"
                >
                  <a-input v-model="healthPort"/>
                </a-form-item>
                <a-form-item
                  label="健康检查命令"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }"
                  v-else
                >
                  <a-input v-model="healthCmd"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24" v-if="healthType==='HTTP'">
              <a-col :span="20">
                <a-form-item
                  label="页面路径"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-input v-model="healthPath"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="首次检查延时"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-input
                    addonAfter="秒"
                    v-model="healthInitialDelay"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="间隔"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-input
                    addonAfter="秒"
                    v-model="healthInterval"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="失败次数阈值"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-input
                    addonAfter="次"
                    v-model="healthFaliureThreshold"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="超时"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-input
                    addonAfter="秒"
                    v-model="healthTimeout"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item :wrapper-col="{ span: 12, offset: 3 }">
                  <a-button type="primary" html-type="submit" @click="serviceUpgrade('health')">
                    保存
                  </a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </template>
      </div>
      <div v-if="activeTabKey === '8'">
        <template>
          <a-form :form="form" hideRequiredMark>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="集群名称"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-input v-model="clusterName" disabled/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="服务名称"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-input v-model="serviceName" disabled/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item
                  label="日志路径"
                  :labelCol="{lg: {span: 3}, sm: {span: 3}}"
                  :wrapperCol="{lg: {span: 17}, sm: {span: 17} }">
                  <a-textarea
                    :rows="8"
                    placeholder="/usr/local/tomcat/logs/
/var/log/yum.log
/var/log/messages
/tmp/gc.log
多个日志按换行填入,目录以/结尾,路径可以使用$item变量,$item为服务名称配置时需要先配置kfak地址信息,filebeat将日志输出到kafka中"
                    v-model="logPath"/>
                  </a-textarea></a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="20">
                <a-form-item :wrapper-col="{ span: 12, offset: 3 }">
                  <a-button type="primary" html-type="submit" @click="serviceUpgrade('log')">
                    保存
                  </a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </template>
      </div>
    </a-card>

    <a-drawer
      title="容器终端"
      :width="720"
      @close="onWebttyPanelClose"
      :maskClosable="false"
      :visible="showWebttyPanel"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px',}"
    >
      <template>
        <div style="background-color: #000;">
          <div style="border: none;color: #fff;background-color: #000;"> &nbsp; 容器名称:&nbsp;{{ webttyInfo.container }}&nbsp; &nbsp;  所属集群:&nbsp;{{ webttyInfo.cluster }}  &nbsp; &nbsp; 操作员:&nbsp;{{ webttyInfo.username }}&nbsp; &nbsp; 登录时间:&nbsp;{{ webttyInfo.time }}</div>
          <div id="terminalcontainer" style="border: none;background-color: #000;height: '100%'" ref="terminalcontainer" ></div>
        </div>
      </template>
      <div
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }"
      >
        <a-button
          :style="{marginRight: '8px'}"
          @click="onWebttyPanelClose"
        >
          关闭
        </a-button>
      </div>
    </a-drawer>

  </page-layout>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import PageLayout from '@/components/page/PageLayout'
import DetailList from '@/components/tools/DetailList'
import Liquid from '@/components/chart/Liquid'
import { getServiceDetail, getAppContainers } from '@/api/application'
import serviceFetch from '@/api/service'
import 'xterm/dist/xterm.css'
import Terminal from '@/utils/Xterm'
import { clearInterval, setInterval } from 'timers'
import registryFetch from '@/api/registry'
const DetailListItem = DetailList.Item

export default {
  name: 'Advanced',
  components: {
    PageLayout,
    DetailList,
    DetailListItem,
    Liquid
  },
  mixins: [mixinDevice],
  data () {
    return {
      timer: null,
      activeTabKey: '1',
      tabs: {
        items: [
          {
            key: '1',
            title: '概览'
          },
          {
            key: '2',
            title: '伸缩'
          },
          {
            key: '3',
            title: '配置'
          },
          {
            key: '4',
            title: '升级'
          },
          {
            key: '5',
            title: '变量'
          },
          {
            key: '6',
            title: '端口'
          },
          {
            key: '7',
            title: '健康检查'
          },
          {
            key: '8',
            title: '日志路径'
          }
        ],
        active: () => {
          return this.activeTabKey
        },
        callback: (key) => {
          this.activeTabKey = key
        }
      },
      clusterName: '',
      serviceName: '',
      serviceId: '',
      replicas: 0,
      replicasMax: 1,
      replicasMin: 1,
      imageTag: '',
      nowTag: '',
      updateTag: '',
      imageTagArra: [],
      timeSpace: 10,
      envs: '',
      logPath: '',
      showWebttyPanel: true,
      showChart: false,
      serviceDetail: {},
      appContainers: [],
      xterm: null,
      terminalSocket: null,
      webttyInfo: {},
      // form: this.$form.createForm(this),
      operationColumns: [
        {
          title: '容器名称',
          dataIndex: 'ContainerName',
          key: 'ContainerName'
        },
        {
          title: '运行状态',
          dataIndex: 'Status',
          key: 'Status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '镜像',
          dataIndex: 'Image',
          key: 'Image'
        },
        {
          title: '资源',
          dataIndex: 'ResourceName',
          key: 'ResourceName'
        },
        {
          title: 'IP地址',
          dataIndex: 'ContainerIp',
          key: 'ContainerIp'
        },
        {
          title: '创建时间/重启',
          dataIndex: 'CreateTime',
          key: 'CreateTime'
        },
        {
          title: '终端/事件/镜像/日志',
          dataIndex: 'ContainerId',
          key: 'ContainerId',
          scopedSlots: { customRender: 'containerId' }
        }
      ],
      form: this.$form.createForm(this),

      // 配置
      instanceConfig: 'a',
      instanceConfigArra: [
        { id: 'a', title: 'S', cpu: 1, mem: 1 },
        { id: 'b', title: 'M', cpu: 1, mem: 2 },
        { id: 'c', title: 'L', cpu: 2, mem: 4 },
        { id: 'd', title: 'XL', cpu: 2, mem: 8 },
        { id: 'e', title: 'XXL', cpu: 4, mem: 8 },
        { id: 'f', title: 'XXXL', cpu: 4, mem: 16 },
        { id: 'g', title: '自定义', cpu: 4, mem: 16 }
      ],

      gCpu: '',
      gMem: '',

      chooseCpu: '1',
      chooseMem: '1024',

      inputValue: '',
      inputVisible: false,
      ports: ['80'],

      // 健康检查
      healthType: 'HTTP',
      healthPort: '80',
      healthPath: '/healthz',
      healthCmd: 'ls /tmp/',
      healthInitialDelay: '100',
      healthInterval: '60',
      healthFaliureThreshold: '0',
      healthTimeout: '20',

      healthData: [],
      healthDataInfo: {}
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        'Running': status,
        'False': status,
        'Pending': status
      }
      return statusMap[status]
    },
    statusTypeFilter (type) {
      const statusTypeMap = {
        'Running': 'success',
        'False': 'error',
        'Pending': 'warning'
      }
      return statusTypeMap[type]
    }
  },
  created () {
    const self = this
    self.showWebttyPanel = false
    self.getServiceDetail()
  },
  mounted () {
    const self = this
    self.addTimer()
    self.$nextTick(() => { self.showChart = true })
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    handleInputChange (e) {
      this.inputValue = e.target.value
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(function () {
        this.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      const inputValue = this.inputValue
      let ports = this.ports
      if (inputValue && ports.indexOf(inputValue) === -1) {
        ports = [...ports, inputValue]
      }
      Object.assign(this, {
        ports,
        inputVisible: false,
        inputValue: ''
      })
    },
    handleClose (removedTag) {
      const ports = this.ports.filter(port => port !== removedTag)
      this.ports = ports
    },
    handleShowWebtty (id) {
      var that = this
      serviceFetch.getWebttyInfo(id)
        .then(res => {
          var info = res.result
          that.webttyInfo = info
          that.socket()
        })
    },
    onExitWebtty () {
      this.terminalSocket.send('exit\r\n')
    },
    onWebttyPanelClose () {
      this.showWebttyPanel = false
      this.terminalSocket.close()
      this.xterm.destroy()
    },
    getServiceDetail () {
      var self = this
      getServiceDetail(self.$route.params.id)
        .then(res => {
          if (res.status === 200) {
            var info = res.result
            self.serviceDetail = info
            // 绑定值
            self.serviceId = self.serviceDetail.ServiceId
            self.clusterName = self.serviceDetail.ClusterName
            self.serviceName = self.serviceDetail.ServiceName
            self.replicas = self.serviceDetail.Replicas
            self.replicasMax = self.serviceDetail.ReplicasMax
            self.replicasMin = self.serviceDetail.ReplicasMin
            self.chooseCpu = self.serviceDetail.Cpu
            self.chooseMem = self.serviceDetail.Memory
            self.gCpu = self.chooseCpu
            self.gMem = self.chooseMem / 1024

            var tempConfigObj = self.instanceConfigArra.filter(item => item.cpu === self.gCpu && item.mem === self.gMem)
            if (tempConfigObj.length <= 0) {
              self.instanceConfig = 'g'
            } else {
              self.instanceConfig = tempConfigObj[0].id
            }

            self.imageTag = self.serviceDetail.ImageTag
            const tempTagArra = self.imageTag.split(':')
            if (tempTagArra.length >= 2) {
              self.nowTag = tempTagArra[1]
            }

            self.envs = self.serviceDetail.Envs
            self.ports = []
            self.ports.push(self.serviceDetail.ContainerPort)

            // 健康检查
            if (self.serviceDetail.HealthData !== '') {
              const tempHeahthObj = JSON.parse(self.serviceDetail.HealthData)
              self.healthType = tempHeahthObj.HealthType
              self.healthPort = tempHeahthObj.HealthPort
              if (self.healthType === 'HTTP') {
                self.healthPath = tempHeahthObj.HealthPath
              } else {
                self.healthCmd = tempHeahthObj.HealthCmd
              }
              self.healthInitialDelay = tempHeahthObj.HealthInitialDelay
              self.healthInterval = tempHeahthObj.HealthInterval
              self.healthFaliureThreshold = tempHeahthObj.HealthFaliureThreshold
              self.healthTimeout = tempHeahthObj.HealthTimeout
            }

            self.logPath = self.serviceDetail.LogPath

            self.getContainers(info.AppName, info.Entname, info.ServiceName)
            self.getImageInfo()
          }
        })
    },
    getContainers (appName, entName, serviceName) {
      var that = this
      getAppContainers(appName, entName, serviceName)
        .then(res => {
          var info = res.result.data
          that.appContainers = info
        })
    },
    socket (linkpath) {
      var that = this

      var params = '?'// + $.param(this.offset || {})
      params = params + '&pod=' + this.webttyInfo.pod + '&container=' + this.webttyInfo.container + '&namespace=' + this.webttyInfo.namespace + '&username=' + this.webttyInfo.username + '&token=' + this.webttyInfo.token + '&timestamp=' + this.webttyInfo.timestamp + '&cluster=' + this.webttyInfo.cluster
      const ws = new WebSocket('ws:' + document.domain + ':8999/tty' + params)

      ws.onerror = function () {
        that.xterm.write('Sorry! terminal connect error!please try again.\n')
        window.clearInterval(that.xterm._blink)
      }
      ws.onmessage = function (event) {
        console.log('on message:', event.data)
        // xterm.write(that.decodeBase64Content(event.data))
        // that.xterm.write('\n' + that.decodeBase64Content(event.data))
        // 显示终端界面
        that.showWebttyPanel = true
      }
      ws.onopen = function () {
        console.log('ws onopen ')
      }
      ws.onclose = function () {
        console.log('ws closed ')
      }
      that.xterm = new Terminal({
        cols: 20,
        rows: 40,
        screenKeys: true,
        cursorBlink: false,
        convertEol: true,
        scrollback: 1000,
        tabStopWidth: 4
      })
      that.xterm.open(that.$refs.terminalcontainer)
      that.xterm._initialized = true
      that.xterm.fit()
      that.terminalSocket = ws
      that.xterm.attach(ws)
    },
    decodeBase64Content (base64Content) {
      // base64 解码
      let commonContent = base64Content.replace(/\s/g, '+')
      commonContent = Buffer.from(commonContent, 'base64').toString()
      return commonContent
    },
    encodeBase64Content (commonContent) {
      // base64 编码
      const base64Content = Buffer.from(commonContent).toString('base64')
      return base64Content
    },
    addTimer () {
      const self = this
      if (self.timer) {
        clearInterval(self.timer)
      } else {
        self.timer = setInterval(() => {
          self.getServiceDetail()
        }, 10000)
      }
    },
    getImageInfo () {
      var self = this
      var clusterType = 'test'
      clusterType = self.nowTag.substring(0, self.nowTag.indexOf('-'))
      registryFetch.getImageInfo(clusterType + '/' + self.serviceName, clusterType)
        .then(res => {
          const result = res.result
          const tempTags = result.Tags
          self.imageTagArra = tempTags.split(',')
        })
    },
    optionService (replicas, start) {
      const self = this
      return new Promise((resolve, reject) => {
        serviceFetch.serviceOption(self.serviceId, replicas, start)
          .then(res => {
            resolve(res)
            if (res.status) {
              self.$notification['success']({
                message: '成功通知',
                description: res.data
              })
            } else {
              self.$notification['error']({
                message: '错误通知',
                description: res.data
              })
            }
          })
      })
    },
    async optionServiceHanlder (type) {
      const self = this
      if (type === 1) {
        await self.optionService(0, 1)
      } else if (type === 2) {
        await self.optionService(0, 0)
      } else if (type === 3) {
        await self.optionService(0, 0)
        await self.optionService(0, 1)
      }
    },
    flexHandler () {
      const self = this
      self.optionService(1, 0)
    },
    serviceUpgrade (type) {
      const self = this
      let param = {}
      if (type === 'config') {
        param = {
          UpdateType: type,
          Mem: Number(self.chooseMem),
          Cpu: parseFloat(self.chooseCpu)
        }
      } else if (type === 'image') {
        param = {
          UpdateType: type,
          Version: self.nowTag,
          MinReady: Number(self.timeSpace)
        }
      } else if (type === 'env') {
        param = {
          UpdateType: type,
          Env: self.envs
        }
      } else if (type === 'port') {
        param = {
          UpdateType: type,
          Port: self.ports[0]
        }
      } else if (type === 'heath') {
        var tempObj = {
          'HealthType': self.healthType,
          'HealthPort': self.healthPort,
          'HealthInterval': self.healthInterval,
          'HealthInitialDelay': self.healthInitialDelay,
          'HealthFaliureThreshold': self.healthFaliureThreshold,
          'HealthTimeout': self.healthTimeout
        }
        if (self.healthType === 'HTTP') {
          tempObj['HealthPath'] = self.healthPath
        } else if (self.healthType === 'CMD') {
          tempObj['HealthCmd'] = self.healthCmd
        }
        param = {
          UpdateType: type,
          healthData: JSON.parse(tempObj)
        }
      } else if (type === 'log') {
        param = {
          UpdateType: type,
          LogPath: self.logPath
        }
      }
      serviceFetch.serviceUpdate(self.serviceId, param)
        .then(res => {
          if (res.status) {
            self.$notification['success']({
              message: '成功通知',
              description: '服务修改成功'
            })
            self.$router.push(`/application/servicedetail/${self.serviceId}`)
          } else {
            self.$notification['error']({
              message: '错误通知',
              description: res.message
            })
          }
        })
    }
  },
  watch: {
    activeTabKey (val) {
      const self = this
      if (val === '1') {
        self.timer = setInterval(() => {
          self.getServiceDetail()
        }, 10000)
      } else {
        clearInterval(self.timer)
      }
    },
    instanceConfig (val) {
      var self = this
      var tempConfigObj = self.instanceConfigArra.find(item => item.id === val)
      if (!tempConfigObj) {
        self.$message.error(`不存在该系统配置`)
      } else {
        if (val !== 'g') {
          self.chooseCpu = tempConfigObj.cpu
          self.chooseMem = tempConfigObj.mem * 1024
        }
      }
    },
    gCpu (val) {
      var self = this
      if (val) {
        self.chooseCpu = val
      } else {
        self.chooseCpu = 0
      }
    },
    gMem (val) {
      var self = this
      if (val) {
        self.chooseMem = val * 1024
      } else {
        self.chooseMem = 0
      }
    },
    updateTag (val) {
      const self = this
      if (val) {
        if (self.nowTag.indexOf(':') >= 0) {
          self.nowTag = self.nowTag.substring(0, self.nowTag.indexOf(':')) + ':' + val
        } else {
          self.nowTag = self.nowTag + ':' + val
        }
      } else {
        self.nowTag = self.nowTag.substring(0, self.nowTag.indexOf(':'))
      }
    }
  }
}
</script>

<style lang="css">
  .xterm .xterm-viewport{
    /*test*/
    overflow-y: hidden !important;
  }

</style>
