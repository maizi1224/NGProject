export const CellDataType =
  {
    // 小数
    Decimal: 0,

    // 整数
    Integer: 1,

    // 文本
    Text: 2,

    // 日期
    Date: 3,

    // 时间
    DateTime: 4,

    getCellDataType: function(type) {
      let msg = ''
      switch (type) {
        case CellDataType.Decimal:
          msg = '小数'
          break
        case CellDataType.Integer:
          msg = '整数'
          break
        case CellDataType.Text:
          msg = '文本'
          break
        case CellDataType.Date:
          msg = '日期'
          break
        case CellDataType.DateTime:
          msg = '时间'
          break
        default:
          break
      }
      return msg
    },

    getCellDataTypeKv: function() {
      return [
        {
          value: CellDataType.Decimal,
          label: '小数'
        },
        {
          value: CellDataType.Integer,
          label: '整数'
        },
        {
          value: CellDataType.Text,
          label: '文本'
        },
        {
          value: CellDataType.Date,
          label: '日期'
        },
        {
          value: CellDataType.DateTime,
          label: '时间'
        }
      ]
    }
  }
