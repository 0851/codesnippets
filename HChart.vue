<!-- @components CustomChart -->
<!-- Created by Lynn on 2017/7/6 -->
<template>
  <div class="highcharts"></div>
</template>

<script>
  import Highcharts from 'highcharts'
  import _ from 'lodash'
  const viewOptions = {
    chart: {
      type: 'spline'
    },
    title: {
      align: 'left',
      style: {
        fontSize: '24px'
      },
      margin: 30
    },
    tooltip: {
      backgroundColor: '#fff',
      borderColor: '#fff',
      crosshairs: true,
      shared: true,
      borderRadius: 5
    },
    plotOptions: {
      series: {
        lineWidth: 3,
        marker: {
          symbol: 'circle',
          lineWidth: 3
        }
      }
    },
    credits: {
      enabled: false
    },
    legend: {
      align: 'left',
      verticalAlign: 'top',
      margin: 20,
      y: 40,
      itemStyle: {
        fontWeight: 'normal'
      }
    },
    colors: ['#ec632d', '#27bcd4', '#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce',
      '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
    yAxis: {
      title: {
        text: null
      }
    }
  }
  export default {
    props: ['options', 'Highcharts'],
    data () {
      return {
        chart: null
      }
    },
    mounted() {
      if (!this.chart && this.options) {
        this._init()
      }
    },
    methods: {
      addSeries(options) {
        if (!this.chart) {
          return
        }
        this.chart.addSeries(options)
      },
      removeSeries() {
        if (!this.chart) {
          return
        }
        while (this.chart.series.length !== 0) {
          this.chart.series[0].remove()
        }
      },
      update(options) {
        if (!this.chart) {
          return
        }
        this.chart.update(options)
      },
      showLoading(txt) {
        if (!this.chart) {
          return
        }
        this.chart.showLoading(txt)
      },
      hideLoading() {
        if (!this.chart) {
          return
        }
        this.chart.hideLoading()
      },
      _init() {
        if (!this.chart && this.options) {
          const _Highcharts = this.Highcharts || Highcharts
          this.chart = new _Highcharts.Chart(this.$el, _.defaultsDeep(this.options, viewOptions))
        }
      }
    },
    watch: {
      options: {
        handler: function (options) {
          if (!this.chart && options) {
            this._init()
          } else {
            this.chart.update(this.options)
          }
        },
        deep: true
      }
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.destroy()
        this.chart = null
      }
    }
  }
</script>
