<!-- target: entry-index -->

<div class="entry-management-plan">
    <nav class="page-nav" id="page-nav">
        <i class="fa fa-line-chart"></i> 
        <a href="javascript:;" data-page="planmanage">推广管理页性能展示</a>
        <a href="javascript:;" data-page="emanage">便捷管理页性能展示</a>
        <a href="javascript:;" data-page="corefunction">关键词页核心功能性能展示</a>
    </nav>
    <section class="select-date">
        
        <p class="date-select-title">请选择时间：</p>
        <div id="rangeTime" data-ui-type="RangeCalendar" 
            data-ui-name="range-date-select" 
            data-ui-id="range-date-select"
            data-ui-value=""
            data-ui-endless-check="false"
            data-ui-range="2015-05-07 00:00:00,2015-05-10 23:59:59"
            data-ui-showed-short-cut="昨天,最近7天,上周">
        </div>
        
    </section>
    <div class="charts">
        <!--  <div class="performance-line-chart"></div>  -->
        
        <fc-performance-line-chart></fc-performance-line-chart>
        
    </div>
</div>
