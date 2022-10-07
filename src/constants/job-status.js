export const JobStatus = {
  Started: 0,
  Running: 1,
  Executing: 2,
  Completed: 3,
  Planning: 4,
  Stopped: 5,
  convertJobStatus: function(status) {
    let msg = ''
    switch (status) {
      case JobStatus.Started:
        msg = '已启用'
        break
      case JobStatus.Running:
        msg = '运行中'
        break
      case JobStatus.Executing:
        msg = '执行中'
        break
      case JobStatus.Completed:
        msg = '执行完成'
        break
      case JobStatus.Planning:
        msg = '任务计划中'
        break
      case JobStatus.Stopped:
        msg = '已停止'
        break
    }
    return msg
  }
}
