<?php declare(strict_types = 1);

// odsl-/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard
return \PHPStan\Cache\CacheItem::__set_state(array(
   'variableKey' => 'v1',
   'data' => 
  array (
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Providers/DashboardDomainServiceProvider.php' => 
    array (
      0 => '96eedce49f8a91331b1fb5fa74363c85f07db51a',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\providers\\dashboarddomainserviceprovider',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\providers\\register',
        1 => 'app\\domains\\dashboard\\providers\\boot',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Providers/EventServiceProvider.php' => 
    array (
      0 => 'c6c8038b3574fc5d5c5eda86e267bb58c528cdb5',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\providers\\eventserviceprovider',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\providers\\boot',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Models/DashboardWidget.php' => 
    array (
      0 => '2d609ded7058e93effc9e4d324e102fd5598f5e9',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\models\\dashboardwidget',
      ),
      2 => 
      array (
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Models/DashboardShare.php' => 
    array (
      0 => 'debfc2ff5b4fa9b9f8c0ccf16ad5a6424942484b',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\models\\dashboardshare',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\models\\generatetoken',
        1 => 'app\\domains\\dashboard\\models\\isvalid',
        2 => 'app\\domains\\dashboard\\models\\recordaccess',
        3 => 'app\\domains\\dashboard\\models\\user',
        4 => 'app\\domains\\dashboard\\models\\dashboard',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Policies/DashboardPolicy.php' => 
    array (
      0 => '052eb42d5879392f780372e91bbd01dded5dec90',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\policies\\dashboardpolicy',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\policies\\before',
        1 => 'app\\domains\\dashboard\\policies\\viewany',
        2 => 'app\\domains\\dashboard\\policies\\view',
        3 => 'app\\domains\\dashboard\\policies\\export',
        4 => 'app\\domains\\dashboard\\policies\\viewleadstrend',
        5 => 'app\\domains\\dashboard\\policies\\viewsegmentgrowth',
        6 => 'app\\domains\\dashboard\\policies\\viewscoredistribution',
        7 => 'app\\domains\\dashboard\\policies\\viewprojectsstats',
        8 => 'app\\domains\\dashboard\\policies\\createwidget',
        9 => 'app\\domains\\dashboard\\policies\\updatewidget',
        10 => 'app\\domains\\dashboard\\policies\\deletewidget',
        11 => 'app\\domains\\dashboard\\policies\\create',
        12 => 'app\\domains\\dashboard\\policies\\update',
        13 => 'app\\domains\\dashboard\\policies\\delete',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Http/Resources/DashboardMetricResource.php' => 
    array (
      0 => 'b25d9fbd67189cd3100e3c0592068b33dcccfe22',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\http\\resources\\dashboardmetricresource',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\http\\resources\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Http/Requests/GetDashboardMetricsRequest.php' => 
    array (
      0 => '9857945b56f3cd8e9cb2c3f99f562d0be6163099',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\http\\requests\\getdashboardmetricsrequest',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\http\\requests\\authorize',
        1 => 'app\\domains\\dashboard\\http\\requests\\rules',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Http/Controllers/DashboardController.php' => 
    array (
      0 => 'c9b812d643a9a0927b008ac88af09cf1e687b120',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\http\\controllers\\dashboardcontroller',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\http\\controllers\\getprojectid',
        1 => 'app\\domains\\dashboard\\http\\controllers\\applyprojectfilter',
        2 => 'app\\domains\\dashboard\\http\\controllers\\__construct',
        3 => 'app\\domains\\dashboard\\http\\controllers\\renderdashboard',
        4 => 'app\\domains\\dashboard\\http\\controllers\\getdata',
        5 => 'app\\domains\\dashboard\\http\\controllers\\getmetrics',
        6 => 'app\\domains\\dashboard\\http\\controllers\\getactivities',
        7 => 'app\\domains\\dashboard\\http\\controllers\\getoverview',
        8 => 'app\\domains\\dashboard\\http\\controllers\\getwidgets',
        9 => 'app\\domains\\dashboard\\http\\controllers\\getwidget',
        10 => 'app\\domains\\dashboard\\http\\controllers\\createwidget',
        11 => 'app\\domains\\dashboard\\http\\controllers\\updatewidget',
        12 => 'app\\domains\\dashboard\\http\\controllers\\deletewidget',
        13 => 'app\\domains\\dashboard\\http\\controllers\\refreshwidget',
        14 => 'app\\domains\\dashboard\\http\\controllers\\getwidgetdata',
        15 => 'app\\domains\\dashboard\\http\\controllers\\getlayouts',
        16 => 'app\\domains\\dashboard\\http\\controllers\\getlayout',
        17 => 'app\\domains\\dashboard\\http\\controllers\\savelayout',
        18 => 'app\\domains\\dashboard\\http\\controllers\\updatelayout',
        19 => 'app\\domains\\dashboard\\http\\controllers\\deletelayout',
        20 => 'app\\domains\\dashboard\\http\\controllers\\setdefaultlayout',
        21 => 'app\\domains\\dashboard\\http\\controllers\\exportdashboard',
        22 => 'app\\domains\\dashboard\\http\\controllers\\sharedashboard',
        23 => 'app\\domains\\dashboard\\http\\controllers\\getshareddashboard',
        24 => 'app\\domains\\dashboard\\http\\controllers\\getalerts',
        25 => 'app\\domains\\dashboard\\http\\controllers\\markalertasread',
        26 => 'app\\domains\\dashboard\\http\\controllers\\markallalertsasread',
        27 => 'app\\domains\\dashboard\\http\\controllers\\subscribetoupdates',
        28 => 'app\\domains\\dashboard\\http\\controllers\\unsubscribefromupdates',
        29 => 'app\\domains\\dashboard\\http\\controllers\\calculatetotalrevenue',
        30 => 'app\\domains\\dashboard\\http\\controllers\\calculaterevenuegrowth',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Http/Controllers/WidgetsController.php' => 
    array (
      0 => '108bc050bf159193c39de1720623603e9fbb0b40',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\http\\controllers\\widgetscontroller',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\http\\controllers\\__construct',
        1 => 'app\\domains\\dashboard\\http\\controllers\\index',
        2 => 'app\\domains\\dashboard\\http\\controllers\\store',
        3 => 'app\\domains\\dashboard\\http\\controllers\\show',
        4 => 'app\\domains\\dashboard\\http\\controllers\\update',
        5 => 'app\\domains\\dashboard\\http\\controllers\\destroy',
        6 => 'app\\domains\\dashboard\\http\\controllers\\reorder',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Http/Controllers/LayoutController.php' => 
    array (
      0 => '6730cb3feb4e5dc5aa59b7663c056e93ae2849dc',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\http\\controllers\\layoutcontroller',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\http\\controllers\\__construct',
        1 => 'app\\domains\\dashboard\\http\\controllers\\show',
        2 => 'app\\domains\\dashboard\\http\\controllers\\store',
        3 => 'app\\domains\\dashboard\\http\\controllers\\update',
        4 => 'app\\domains\\dashboard\\http\\controllers\\destroy',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Http/Controllers/CustomizationController.php' => 
    array (
      0 => '8d21cb00bba0763b9f7a52d59851b7588c367f8f',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\http\\controllers\\customizationcontroller',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\http\\controllers\\__construct',
        1 => 'app\\domains\\dashboard\\http\\controllers\\show',
        2 => 'app\\domains\\dashboard\\http\\controllers\\store',
        3 => 'app\\domains\\dashboard\\http\\controllers\\update',
        4 => 'app\\domains\\dashboard\\http\\controllers\\load',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Queries/ListDashboardWidgetsQuery.php' => 
    array (
      0 => '95a9933bb687846268843b6e6d45bce25140c2d5',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\queries\\listdashboardwidgetsquery',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\queries\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Queries/GetDashboardWidgetQuery.php' => 
    array (
      0 => '816e250f9493bca94d16a07583300a4174d63b6b',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\queries\\getdashboardwidgetquery',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\queries\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Queries/GetDashboardMetricsQuery.php' => 
    array (
      0 => '26bc143245d307c07bfce07fdcee12111b7aa3f7',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\queries\\getdashboardmetricsquery',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\queries\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Queries/GetDashboardOverviewQuery.php' => 
    array (
      0 => 'd4ad89901508ad5c3d75e46e6b7ae4c4573c9f6a',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\queries\\getdashboardoverviewquery',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\queries\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Commands/UpdateDashboardWidgetCommand.php' => 
    array (
      0 => '72a2a8309123f2f73865748ede3dda42f799ff9a',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\commands\\updatedashboardwidgetcommand',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\commands\\__construct',
        1 => 'app\\domains\\dashboard\\application\\commands\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Commands/DeleteDashboardWidgetCommand.php' => 
    array (
      0 => '8125231f73406995307329d26e75f9c80087c969',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\commands\\deletedashboardwidgetcommand',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\commands\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Commands/ExportDashboardDataCommand.php' => 
    array (
      0 => 'b8f6ddb73dc3031b54a0c569dd229af7e9fdc6e6',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\commands\\exportdashboarddatacommand',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\commands\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Commands/CreateDashboardWidgetCommand.php' => 
    array (
      0 => 'd4fa26442b28e8d200a054050d0274c0294eee2c',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\commands\\createdashboardwidgetcommand',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\commands\\__construct',
        1 => 'app\\domains\\dashboard\\application\\commands\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Commands/RefreshDashboardDataCommand.php' => 
    array (
      0 => '26e7e58f8745aeeb4202b5db36b783eda5e80200',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\commands\\refreshdashboarddatacommand',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\commands\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Handlers/GetDashboardWidgetHandler.php' => 
    array (
      0 => 'e1cd44e2f3ef6c36fb74f37712136581508e6737',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\handlers\\getdashboardwidgethandler',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\handlers\\__construct',
        1 => 'app\\domains\\dashboard\\application\\handlers\\handle',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Handlers/RefreshDashboardDataHandler.php' => 
    array (
      0 => 'ad2379db5e57729d82dc1f0675311246ed3494f9',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\handlers\\refreshdashboarddatahandler',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\handlers\\__construct',
        1 => 'app\\domains\\dashboard\\application\\handlers\\handle',
        2 => 'app\\domains\\dashboard\\application\\handlers\\refreshwidgetdata',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Handlers/UpdateDashboardWidgetHandler.php' => 
    array (
      0 => 'd4b2b4d631402871bf42e3e05ff1172726d9e302',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\handlers\\updatedashboardwidgethandler',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\handlers\\__construct',
        1 => 'app\\domains\\dashboard\\application\\handlers\\handle',
        2 => 'app\\domains\\dashboard\\application\\handlers\\validatewidgetconfiguration',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Handlers/DeleteDashboardWidgetHandler.php' => 
    array (
      0 => '9d1f72ada6317820c1e043eff2de19de22b90d3e',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\handlers\\deletedashboardwidgethandler',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\handlers\\__construct',
        1 => 'app\\domains\\dashboard\\application\\handlers\\handle',
        2 => 'app\\domains\\dashboard\\application\\handlers\\iscriticalwidget',
        3 => 'app\\domains\\dashboard\\application\\handlers\\reorganizewidgetpositions',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Handlers/ExportDashboardDataHandler.php' => 
    array (
      0 => '789626d0a366428a1dd0b9fb6478c52c92ac1dfd',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\handlers\\exportdashboarddatahandler',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\handlers\\__construct',
        1 => 'app\\domains\\dashboard\\application\\handlers\\handle',
        2 => 'app\\domains\\dashboard\\application\\handlers\\validateexportformat',
        3 => 'app\\domains\\dashboard\\application\\handlers\\getwidgetsforexport',
        4 => 'app\\domains\\dashboard\\application\\handlers\\generateexportfile',
        5 => 'app\\domains\\dashboard\\application\\handlers\\generatecsvexport',
        6 => 'app\\domains\\dashboard\\application\\handlers\\generateexcelexport',
        7 => 'app\\domains\\dashboard\\application\\handlers\\generatepdfexport',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Handlers/GetDashboardMetricsHandler.php' => 
    array (
      0 => 'ecab2f5f8e52ca4c75d2bb0168fccac152df9035',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\handlers\\getdashboardmetricshandler',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\handlers\\__construct',
        1 => 'app\\domains\\dashboard\\application\\handlers\\handle',
        2 => 'app\\domains\\dashboard\\application\\handlers\\getleadsmetrics',
        3 => 'app\\domains\\dashboard\\application\\handlers\\getprojectsmetrics',
        4 => 'app\\domains\\dashboard\\application\\handlers\\getanalyticsmetrics',
        5 => 'app\\domains\\dashboard\\application\\handlers\\getperformancemetrics',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Handlers/ListDashboardWidgetsHandler.php' => 
    array (
      0 => '65a935c6854980a8c53463c8b712518afda7dea0',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\handlers\\listdashboardwidgetshandler',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\handlers\\__construct',
        1 => 'app\\domains\\dashboard\\application\\handlers\\handle',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Handlers/CreateDashboardWidgetHandler.php' => 
    array (
      0 => '3eb6442c45cdef35b0205984581468f5d09fbf19',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\handlers\\createdashboardwidgethandler',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\handlers\\__construct',
        1 => 'app\\domains\\dashboard\\application\\handlers\\handle',
        2 => 'app\\domains\\dashboard\\application\\handlers\\validatewidgettype',
        3 => 'app\\domains\\dashboard\\application\\handlers\\validatewidgetconfiguration',
        4 => 'app\\domains\\dashboard\\application\\handlers\\getnextposition',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Handlers/GetDashboardOverviewHandler.php' => 
    array (
      0 => '23f8ca935a6f04073ac299ba9bb6ca0d6a12fbd2',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\handlers\\getdashboardoverviewhandler',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\handlers\\__construct',
        1 => 'app\\domains\\dashboard\\application\\handlers\\handle',
        2 => 'app\\domains\\dashboard\\application\\handlers\\getmetricvalue',
        3 => 'app\\domains\\dashboard\\application\\handlers\\gettrenddata',
        4 => 'app\\domains\\dashboard\\application\\handlers\\getperformancedata',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/UseCases/RefreshDashboardDataUseCase.php' => 
    array (
      0 => 'b9e33992081c42fc30d40d6a846f27149af2e758',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\usecases\\refreshdashboarddatausecase',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\usecases\\__construct',
        1 => 'app\\domains\\dashboard\\application\\usecases\\execute',
        2 => 'app\\domains\\dashboard\\application\\usecases\\checkrefreshratelimit',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/UseCases/GetDashboardOverviewUseCase.php' => 
    array (
      0 => '2165f823dc666ea7b020e40b28cefff3d43175f7',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\usecases\\getdashboardoverviewusecase',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\usecases\\__construct',
        1 => 'app\\domains\\dashboard\\application\\usecases\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/UseCases/CreateDashboardWidgetUseCase.php' => 
    array (
      0 => 'a0893dddb4649387b14c6247af17521a6b047610',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\usecases\\createdashboardwidgetusecase',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\usecases\\__construct',
        1 => 'app\\domains\\dashboard\\application\\usecases\\execute',
        2 => 'app\\domains\\dashboard\\application\\usecases\\checkwidgetlimit',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/UseCases/ExportDashboardDataUseCase.php' => 
    array (
      0 => '6c92ae091c7367bf637b0e02363995fb52a393d2',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\usecases\\exportdashboarddatausecase',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\usecases\\__construct',
        1 => 'app\\domains\\dashboard\\application\\usecases\\execute',
        2 => 'app\\domains\\dashboard\\application\\usecases\\checkexportlimit',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Services/DashboardApplicationService.php' => 
    array (
      0 => 'f0149eba009b1a6723e67ece0398aa04d37d6db7',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\services\\dashboardapplicationservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\services\\__construct',
        1 => 'app\\domains\\dashboard\\application\\services\\createwidget',
        2 => 'app\\domains\\dashboard\\application\\services\\refreshdata',
        3 => 'app\\domains\\dashboard\\application\\services\\exportdata',
        4 => 'app\\domains\\dashboard\\application\\services\\getoverview',
        5 => 'app\\domains\\dashboard\\application\\services\\createmetriccard',
        6 => 'app\\domains\\dashboard\\application\\services\\createchartwidget',
        7 => 'app\\domains\\dashboard\\application\\services\\createtablewidget',
        8 => 'app\\domains\\dashboard\\application\\services\\refreshallwidgets',
        9 => 'app\\domains\\dashboard\\application\\services\\refreshwidget',
        10 => 'app\\domains\\dashboard\\application\\services\\exporttocsv',
        11 => 'app\\domains\\dashboard\\application\\services\\exporttoexcel',
        12 => 'app\\domains\\dashboard\\application\\services\\exporttopdf',
        13 => 'app\\domains\\dashboard\\application\\services\\getoverviewmetrics',
        14 => 'app\\domains\\dashboard\\application\\services\\getleadsmetrics',
        15 => 'app\\domains\\dashboard\\application\\services\\getprojectsmetrics',
        16 => 'app\\domains\\dashboard\\application\\services\\getanalyticsmetrics',
        17 => 'app\\domains\\dashboard\\application\\services\\getperformancemetrics',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Services/WidgetService.php' => 
    array (
      0 => '3d2f06af423034cb04aa06d0c6f59032ca9960a3',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\services\\widgetservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\services\\getallwidgets',
        1 => 'app\\domains\\dashboard\\application\\services\\getwidgetbyid',
        2 => 'app\\domains\\dashboard\\application\\services\\createwidget',
        3 => 'app\\domains\\dashboard\\application\\services\\updatewidget',
        4 => 'app\\domains\\dashboard\\application\\services\\deletewidget',
        5 => 'app\\domains\\dashboard\\application\\services\\reorderwidgets',
        6 => 'app\\domains\\dashboard\\application\\services\\togglewidgetstatus',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Services/LayoutService.php' => 
    array (
      0 => '517cf07664036d76f59c0a0c048f503737453e44',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\services\\layoutservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\services\\getlayoutbyuserid',
        1 => 'app\\domains\\dashboard\\application\\services\\createlayout',
        2 => 'app\\domains\\dashboard\\application\\services\\updatelayout',
        3 => 'app\\domains\\dashboard\\application\\services\\saveorupdatelayout',
        4 => 'app\\domains\\dashboard\\application\\services\\resetlayout',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Services/CustomizationService.php' => 
    array (
      0 => 'a0c3be33ea0e2f29bb28648c971e8badc34c9166',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\services\\customizationservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\services\\getconfigbyuserid',
        1 => 'app\\domains\\dashboard\\application\\services\\saveorupdateconfig',
        2 => 'app\\domains\\dashboard\\application\\services\\updatepreferences',
        3 => 'app\\domains\\dashboard\\application\\services\\updatevisiblewidgets',
        4 => 'app\\domains\\dashboard\\application\\services\\resetconfig',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Services/MetricsAggregatorService.php' => 
    array (
      0 => '3eacd5ef88e5963f7d407330a1200dcf01252ea1',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\services\\metricsaggregatorservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\services\\getaggregatedmetrics',
        1 => 'app\\domains\\dashboard\\application\\services\\gettotalprojects',
        2 => 'app\\domains\\dashboard\\application\\services\\gettotalleads',
        3 => 'app\\domains\\dashboard\\application\\services\\gettotalproducts',
        4 => 'app\\domains\\dashboard\\application\\services\\getactiveworkflows',
        5 => 'app\\domains\\dashboard\\application\\services\\getrecentactivities',
        6 => 'app\\domains\\dashboard\\application\\services\\getconversionrate',
        7 => 'app\\domains\\dashboard\\application\\services\\getrevenue',
        8 => 'app\\domains\\dashboard\\application\\services\\getgrowthmetrics',
        9 => 'app\\domains\\dashboard\\application\\services\\clearcache',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Services/RealTimeService.php' => 
    array (
      0 => '4d6975468b892359b6a49bdc42ca2b84f12be6d6',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\services\\realtimeservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\services\\broadcastmetricupdate',
        1 => 'app\\domains\\dashboard\\application\\services\\broadcastwidgetupdate',
        2 => 'app\\domains\\dashboard\\application\\services\\broadcastlayoutupdate',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/DTOs/WidgetDTO.php' => 
    array (
      0 => 'f8d631b900e44935f75e789a778457357c5425a2',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\dtos\\widgetdto',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\dtos\\__construct',
        1 => 'app\\domains\\dashboard\\application\\dtos\\toarray',
        2 => 'app\\domains\\dashboard\\application\\dtos\\fromarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/DTOs/LayoutDTO.php' => 
    array (
      0 => '01ce9c7950690afc18238f7c30fc3388c6850bbd',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\dtos\\layoutdto',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\dtos\\__construct',
        1 => 'app\\domains\\dashboard\\application\\dtos\\toarray',
        2 => 'app\\domains\\dashboard\\application\\dtos\\fromarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/DTOs/CustomizationDTO.php' => 
    array (
      0 => '7553ee021040e9d541e5ffe5aa95ce7df966235a',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\dtos\\customizationdto',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\dtos\\__construct',
        1 => 'app\\domains\\dashboard\\application\\dtos\\toarray',
        2 => 'app\\domains\\dashboard\\application\\dtos\\fromarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Actions/CreateWidgetAction.php' => 
    array (
      0 => 'f80e7ebb0a9648e766f6ae61b2d302efbf11ae2b',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\actions\\createwidgetaction',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\actions\\__construct',
        1 => 'app\\domains\\dashboard\\application\\actions\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Actions/UpdateLayoutAction.php' => 
    array (
      0 => '88ffb9ff09aae87f3ebbd311d320a401c9b6ef38',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\actions\\updatelayoutaction',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\actions\\__construct',
        1 => 'app\\domains\\dashboard\\application\\actions\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Actions/SaveCustomizationAction.php' => 
    array (
      0 => 'a7994977c2ce9cfd2e102c27d6d2710fbf6d5a90',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\actions\\savecustomizationaction',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\actions\\__construct',
        1 => 'app\\domains\\dashboard\\application\\actions\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Application/Actions/LoadDashboardAction.php' => 
    array (
      0 => '8833fb89d354cc9e4d6537801b06cb241823ff23',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\actions\\loaddashboardaction',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\application\\actions\\__construct',
        1 => 'app\\domains\\dashboard\\application\\actions\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Events/DashboardWidgetUpdated.php' => 
    array (
      0 => '229dc19c029e9b326304f9ecde5dc66d9703020d',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\events\\dashboardwidgetupdated',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Events/DashboardWidgetCreated.php' => 
    array (
      0 => 'a58dda89057f2b11b4322659eebc603bfbd299ea',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\events\\dashboardwidgetcreated',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Events/DashboardShouldUpdate.php' => 
    array (
      0 => 'a470bf52e2f8cc801dbbe97710feb17d6fcff97a',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\events\\dashboardshouldupdate',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\events\\__construct',
        1 => 'app\\domains\\dashboard\\events\\broadcaston',
        2 => 'app\\domains\\dashboard\\events\\broadcastas',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Events/DashboardWidgetDeleted.php' => 
    array (
      0 => '3870de51a189c0c7005d7ae698dbfe539a326621',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\events\\dashboardwidgetdeleted',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Infrastructure/Persistence/Eloquent/DashboardWidgetModel.php' => 
    array (
      0 => '22d39d651de10c8cd924e305b1333f4ecb23de25',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\infrastructure\\persistence\\eloquent\\dashboardwidgetmodel',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\infrastructure\\persistence\\eloquent\\user',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Infrastructure/Persistence/Eloquent/DashboardWidgetRepository.php' => 
    array (
      0 => '5e374fd1c1537c3fa1f42bdcaff949d269a6edb3',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\infrastructure\\persistence\\eloquent\\dashboardwidgetrepository',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\infrastructure\\persistence\\eloquent\\__construct',
        1 => 'app\\domains\\dashboard\\infrastructure\\persistence\\eloquent\\find',
        2 => 'app\\domains\\dashboard\\infrastructure\\persistence\\eloquent\\findbyuserid',
        3 => 'app\\domains\\dashboard\\infrastructure\\persistence\\eloquent\\create',
        4 => 'app\\domains\\dashboard\\infrastructure\\persistence\\eloquent\\update',
        5 => 'app\\domains\\dashboard\\infrastructure\\persistence\\eloquent\\delete',
        6 => 'app\\domains\\dashboard\\infrastructure\\persistence\\eloquent\\todomain',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Infrastructure/Persistence/Eloquent/WidgetModel.php' => 
    array (
      0 => 'f06c1e010bdcc317711b2836bde1e261299aede1',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\infrastructure\\persistence\\eloquent\\widgetmodel',
      ),
      2 => 
      array (
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Infrastructure/Persistence/Eloquent/DashboardLayoutModel.php' => 
    array (
      0 => '56036d7046256280a54441b2ca595e891e68ab34',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\infrastructure\\persistence\\eloquent\\dashboardlayoutmodel',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\infrastructure\\persistence\\eloquent\\user',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Infrastructure/Persistence/Eloquent/UserDashboardConfigModel.php' => 
    array (
      0 => '18c64042b9ecf9321b4b6cabfe2df7730036a20a',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\infrastructure\\persistence\\eloquent\\userdashboardconfigmodel',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\infrastructure\\persistence\\eloquent\\user',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Infrastructure/Persistence/Eloquent/DashboardAlertModel.php' => 
    array (
      0 => 'c62a9c830c9829daf28fedd22fc207903703cb94',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\infrastructure\\persistence\\eloquent\\dashboardalertmodel',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\infrastructure\\persistence\\eloquent\\user',
        1 => 'app\\domains\\dashboard\\infrastructure\\persistence\\eloquent\\isexpired',
        2 => 'app\\domains\\dashboard\\infrastructure\\persistence\\eloquent\\markasread',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Domain/DashboardWidget.php' => 
    array (
      0 => '823109570801970231cb279f3a42b78dcda2505f',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\domain\\dashboardwidget',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\domain\\__construct',
        1 => 'app\\domains\\dashboard\\domain\\validatetype',
        2 => 'app\\domains\\dashboard\\domain\\validatetitle',
        3 => 'app\\domains\\dashboard\\domain\\validateposition',
        4 => 'app\\domains\\dashboard\\domain\\updateconfig',
        5 => 'app\\domains\\dashboard\\domain\\updateposition',
        6 => 'app\\domains\\dashboard\\domain\\show',
        7 => 'app\\domains\\dashboard\\domain\\hide',
        8 => 'app\\domains\\dashboard\\domain\\getsummary',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Domain/DashboardWidgetRepositoryInterface.php' => 
    array (
      0 => 'f38b5801315dcc877fea903b54e1090f48cfb892',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\domain\\dashboardwidgetrepositoryinterface',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\domain\\find',
        1 => 'app\\domains\\dashboard\\domain\\findbyuserid',
        2 => 'app\\domains\\dashboard\\domain\\create',
        3 => 'app\\domains\\dashboard\\domain\\update',
        4 => 'app\\domains\\dashboard\\domain\\delete',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Observers/DashboardWidgetObserver.php' => 
    array (
      0 => '0b1a918001cf5896858dcc50c7761178aeba623d',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\observers\\dashboardwidgetobserver',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\observers\\created',
        1 => 'app\\domains\\dashboard\\observers\\updated',
        2 => 'app\\domains\\dashboard\\observers\\deleted',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Listeners/DashboardCacheListener.php' => 
    array (
      0 => '53609e88e3114e956804d809f87f7644932f5683',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\listeners\\dashboardcachelistener',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\listeners\\handle',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Services/DashboardService.php' => 
    array (
      0 => 'a8fc6e008c633afcfb28f8d0c1629eaf5675d05e',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\services\\dashboardservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\services\\__construct',
        1 => 'app\\domains\\dashboard\\services\\getoverviewmetrics',
        2 => 'app\\domains\\dashboard\\services\\getleadstrend',
        3 => 'app\\domains\\dashboard\\services\\getsegmentgrowth',
        4 => 'app\\domains\\dashboard\\services\\getscoredistribution',
        5 => 'app\\domains\\dashboard\\services\\getprojectsstats',
        6 => 'app\\domains\\dashboard\\services\\exportdashboarddata',
        7 => 'app\\domains\\dashboard\\services\\getuserdashboard',
        8 => 'app\\domains\\dashboard\\services\\updatewidgetconfig',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Dashboard/Repositories/DashboardWidgetRepository.php' => 
    array (
      0 => '72d301ef18de64edcf7d0e1c25cd69871abdb150',
      1 => 
      array (
        0 => 'app\\domains\\dashboard\\repositories\\dashboardwidgetrepository',
      ),
      2 => 
      array (
        0 => 'app\\domains\\dashboard\\repositories\\getwidgetdata',
        1 => 'app\\domains\\dashboard\\repositories\\getmetricsdata',
        2 => 'app\\domains\\dashboard\\repositories\\getchartdata',
        3 => 'app\\domains\\dashboard\\repositories\\gettabledata',
        4 => 'app\\domains\\dashboard\\repositories\\getactivitydata',
        5 => 'app\\domains\\dashboard\\repositories\\getleadsdata',
        6 => 'app\\domains\\dashboard\\repositories\\getanalyticsdata',
        7 => 'app\\domains\\dashboard\\repositories\\getworkflowsdata',
        8 => 'app\\domains\\dashboard\\repositories\\getprojectsdata',
        9 => 'app\\domains\\dashboard\\repositories\\getleadstabledata',
        10 => 'app\\domains\\dashboard\\repositories\\getactivitiestabledata',
        11 => 'app\\domains\\dashboard\\repositories\\getworkflowstabledata',
        12 => 'app\\domains\\dashboard\\repositories\\getdefaultdata',
        13 => 'app\\domains\\dashboard\\repositories\\fetchmetricvalue',
        14 => 'app\\domains\\dashboard\\repositories\\fetchdatasourcedata',
        15 => 'app\\domains\\dashboard\\repositories\\getleadschartdata',
        16 => 'app\\domains\\dashboard\\repositories\\getanalyticschartdata',
        17 => 'app\\domains\\dashboard\\repositories\\getworkflowschartdata',
        18 => 'app\\domains\\dashboard\\repositories\\invalidatecache',
      ),
      3 => 
      array (
      ),
    ),
  ),
));