package com.zhaxd.web.controller;

import javax.servlet.http.HttpServletRequest;

import com.zhaxd.core.dto.ResultDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zhaxd.common.toolkit.Constant;
import com.zhaxd.core.dto.BootTablePage;
import com.zhaxd.core.model.KUser;
import com.zhaxd.web.service.JobMonitorService;
import com.zhaxd.web.utils.JsonUtils;

@RestController
@RequestMapping("/job/monitor/")
public class JobMonitorController {

    @Autowired
    private JobMonitorService jobMonitorService;

    @RequestMapping("getList.shtml")
    public String getList(Integer offset, Integer limit, Integer monitorStatus, Integer categoryId, String jobName, HttpServletRequest request) {
        KUser kUser = (KUser) request.getSession().getAttribute(Constant.SESSION_ID);
        BootTablePage list = jobMonitorService.getList(offset, limit, monitorStatus,categoryId, jobName, kUser.getuId());
        return JsonUtils.objectToJson(list);
    }

    @RequestMapping("getAllMonitorJob.shtml")
    public String getAllMonitorJob(HttpServletRequest request) {
        KUser kUser = (KUser) request.getSession().getAttribute(Constant.SESSION_ID);
        return JsonUtils.objectToJson(jobMonitorService.getAllMonitorJob(kUser.getuId()));
    }

    @RequestMapping("getAllSuccess.shtml")
    public String getAllSuccess(HttpServletRequest request) {
        KUser kUser = (KUser) request.getSession().getAttribute(Constant.SESSION_ID);
        return JsonUtils.objectToJson(jobMonitorService.getAllSuccess(kUser.getuId()));
    }

    @RequestMapping("getAllFail.shtml")
    public String getAllFail(HttpServletRequest request) {
        KUser kUser = (KUser) request.getSession().getAttribute(Constant.SESSION_ID);
        return JsonUtils.objectToJson(jobMonitorService.getAllFail(kUser.getuId()));
    }

    @RequestMapping("getJobMonitor.shtml")
    public String getJobMonitor(Integer monitorId) {
        return ResultDto.success(jobMonitorService.getJobMonitor(monitorId));
    }

    @RequestMapping("update.shtml")
    public String update(Integer monitorId,String lastExecuteTime, String lastSuccessTime) {
        try {
            jobMonitorService.update(monitorId, lastExecuteTime, lastSuccessTime);
            return ResultDto.success();
        } catch (Exception e) {
            return ResultDto.success(e.toString());
        }
    }
}
