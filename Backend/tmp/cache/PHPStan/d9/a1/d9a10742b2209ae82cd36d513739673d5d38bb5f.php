<?php declare(strict_types = 1);

// odsl-/root/projetos/xWin_Dash/Backend/app/Domains/Leads
return \PHPStan\Cache\CacheItem::__set_state(array(
   'variableKey' => 'v1',
   'data' => 
  array (
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Contracts/LeadRepositoryInterface.php' => 
    array (
      0 => '04d54c1fe8f10ca3ad31db38931e85899ead2003',
      1 => 
      array (
        0 => 'app\\domains\\leads\\contracts\\leadrepositoryinterface',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\contracts\\create',
        1 => 'app\\domains\\leads\\contracts\\find',
        2 => 'app\\domains\\leads\\contracts\\findbyemail',
        3 => 'app\\domains\\leads\\contracts\\update',
        4 => 'app\\domains\\leads\\contracts\\delete',
        5 => 'app\\domains\\leads\\contracts\\getallpaginated',
        6 => 'app\\domains\\leads\\contracts\\paginate',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Contracts/LeadServiceInterface.php' => 
    array (
      0 => '416c931d8f9d53d5c32c0823782bf53baa2883cf',
      1 => 
      array (
        0 => 'app\\domains\\leads\\contracts\\leadserviceinterface',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\contracts\\createlead',
        1 => 'app\\domains\\leads\\contracts\\getleadbyid',
        2 => 'app\\domains\\leads\\contracts\\updatelead',
        3 => 'app\\domains\\leads\\contracts\\deletelead',
        4 => 'app\\domains\\leads\\contracts\\getallleads',
        5 => 'app\\domains\\leads\\contracts\\updateleadstatus',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Contracts/SegmentServiceInterface.php' => 
    array (
      0 => 'a9ca1e81fe8ede01887191faa3caaa302a6c708c',
      1 => 
      array (
        0 => 'app\\domains\\leads\\contracts\\segmentserviceinterface',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\contracts\\createsegment',
        1 => 'app\\domains\\leads\\contracts\\getsegmentbyid',
        2 => 'app\\domains\\leads\\contracts\\updatesegment',
        3 => 'app\\domains\\leads\\contracts\\deletesegment',
        4 => 'app\\domains\\leads\\contracts\\getallsegments',
        5 => 'app\\domains\\leads\\contracts\\evaluatesegmentrules',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Providers/LeadsDomainServiceProvider.php' => 
    array (
      0 => '9827143af99beedb445bc1a1a5826d2b24610ab9',
      1 => 
      array (
        0 => 'app\\domains\\leads\\providers\\leadsdomainserviceprovider',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\providers\\register',
        1 => 'app\\domains\\leads\\providers\\boot',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Providers/LeadServiceProvider.php' => 
    array (
      0 => '8dd1c7daa17971af1a1d5871f83947ec2283df65',
      1 => 
      array (
        0 => 'app\\domains\\leads\\providers\\leadserviceprovider',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\providers\\register',
        1 => 'app\\domains\\leads\\providers\\boot',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Providers/EventServiceProvider.php' => 
    array (
      0 => '5e380e22a8a33f49dca0f2caa23ec7d6ec1e73e5',
      1 => 
      array (
        0 => 'app\\domains\\leads\\providers\\eventserviceprovider',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\providers\\boot',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Workflows/LeadNurturingWorkflow.php' => 
    array (
      0 => '9537f3d15e74cdf5d953a36b554e3595194238f2',
      1 => 
      array (
        0 => 'app\\domains\\leads\\workflows\\leadnurturingworkflow',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\workflows\\__construct',
        1 => 'app\\domains\\leads\\workflows\\start',
        2 => 'app\\domains\\leads\\workflows\\evaluate',
        3 => 'app\\domains\\leads\\workflows\\transitionto',
        4 => 'app\\domains\\leads\\workflows\\executestateactions',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Repositories/CacheService.php' => 
    array (
      0 => '38cbec548f43812661c9ada33d5277352b11fa51',
      1 => 
      array (
        0 => 'app\\domains\\leads\\repositories\\cacheservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\repositories\\put',
        1 => 'app\\domains\\leads\\repositories\\get',
        2 => 'app\\domains\\leads\\repositories\\forget',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Repositories/LeadHistoryRepository.php' => 
    array (
      0 => 'd57fb456038330785e0633c6330f446fce965bd1',
      1 => 
      array (
        0 => 'app\\domains\\leads\\repositories\\leadhistoryrepository',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\repositories\\__construct',
        1 => 'app\\domains\\leads\\repositories\\create',
        2 => 'app\\domains\\leads\\repositories\\find',
        3 => 'app\\domains\\leads\\repositories\\getbyleadid',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Models/Lead.php' => 
    array (
      0 => 'ba201f5edb0acee405680c28accba66d0f9c1d8d',
      1 => 
      array (
        0 => 'app\\domains\\leads\\models\\lead',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\models\\boot',
        1 => 'app\\domains\\leads\\models\\newfactory',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Exceptions/LeadRepositoryException.php' => 
    array (
      0 => 'd71b6aa43db57a6f560ee7bd97a51753f68f5ead',
      1 => 
      array (
        0 => 'app\\domains\\leads\\exceptions\\leadrepositoryexception',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\exceptions\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Exceptions/IntegrationNotImplementedException.php' => 
    array (
      0 => 'baecf4b54a55aa56d8151a24a32d0618b8d8d6d0',
      1 => 
      array (
        0 => 'app\\domains\\leads\\exceptions\\integrationnotimplementedexception',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\exceptions\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Policies/LeadPolicy.php' => 
    array (
      0 => '01ff78a411db2aea6e54fa16f19c13b28ad7dad9',
      1 => 
      array (
        0 => 'app\\domains\\leads\\policies\\leadpolicy',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\policies\\viewany',
        1 => 'app\\domains\\leads\\policies\\view',
        2 => 'app\\domains\\leads\\policies\\create',
        3 => 'app\\domains\\leads\\policies\\update',
        4 => 'app\\domains\\leads\\policies\\delete',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Policies/SegmentPolicy.php' => 
    array (
      0 => 'b9f1dd5740eafe0397ce1de4c4b8c87f9abbd7db',
      1 => 
      array (
        0 => 'app\\domains\\leads\\policies\\segmentpolicy',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\policies\\viewany',
        1 => 'app\\domains\\leads\\policies\\view',
        2 => 'app\\domains\\leads\\policies\\create',
        3 => 'app\\domains\\leads\\policies\\update',
        4 => 'app\\domains\\leads\\policies\\delete',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Policies/LeadCustomFieldPolicy.php' => 
    array (
      0 => '7d71b4dab9818b6f0cb68c8d6258da215b0efa78',
      1 => 
      array (
        0 => 'app\\domains\\leads\\policies\\leadcustomfieldpolicy',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\policies\\viewany',
        1 => 'app\\domains\\leads\\policies\\view',
        2 => 'app\\domains\\leads\\policies\\create',
        3 => 'app\\domains\\leads\\policies\\update',
        4 => 'app\\domains\\leads\\policies\\delete',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Policies/LeadHistoryPolicy.php' => 
    array (
      0 => '042b18631712c65e358a6cb589e746215bad9861',
      1 => 
      array (
        0 => 'app\\domains\\leads\\policies\\leadhistorypolicy',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\policies\\viewany',
        1 => 'app\\domains\\leads\\policies\\view',
        2 => 'app\\domains\\leads\\policies\\create',
        3 => 'app\\domains\\leads\\policies\\update',
        4 => 'app\\domains\\leads\\policies\\delete',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Sagas/ImportLeadsSaga.php' => 
    array (
      0 => 'e009b24762bcc66d66f98c3cf317221194e4d2b2',
      1 => 
      array (
        0 => 'app\\domains\\leads\\sagas\\importleadssaga',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\sagas\\__construct',
        1 => 'app\\domains\\leads\\sagas\\startimport',
        2 => 'app\\domains\\leads\\sagas\\parseleadfile',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Resources/LeadResource.php' => 
    array (
      0 => '517d89126610816cddb1c9a8ae4cdd44250f02cd',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\resources\\leadresource',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\resources\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Resources/SegmentResource.php' => 
    array (
      0 => '225be012e39d4059bb4df7694db9cc61cbc586f1',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\resources\\segmentresource',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\resources\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Resources/LeadMetricsResource.php' => 
    array (
      0 => '738668ebfc52e866033f247186774ad10a988ef9',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\resources\\leadmetricsresource',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\resources\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Resources/LeadCustomFieldResource.php' => 
    array (
      0 => '422e924682d0f4de7466a0b99f552c79d67980e1',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\resources\\leadcustomfieldresource',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\resources\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Resources/LeadCustomValueResource.php' => 
    array (
      0 => 'a689c5368294182bf5ae4fa1c1c8c22cbde7d565',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\resources\\leadcustomvalueresource',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\resources\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Resources/LeadHistoryResource.php' => 
    array (
      0 => '35fde7f76d90af03d0a86350f6c7f608f0063bdf',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\resources\\leadhistoryresource',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\resources\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Requests/StoreLeadHistoryRequest.php' => 
    array (
      0 => '4b7fe9279193962b2c7b207e5a388f46673cd993',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\storeleadhistoryrequest',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\authorize',
        1 => 'app\\domains\\leads\\http\\requests\\rules',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Requests/UpdateLeadRequest.php' => 
    array (
      0 => '1582be8876752adcbdaed52e22f61ca1391135d4',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\updateleadrequest',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\authorize',
        1 => 'app\\domains\\leads\\http\\requests\\rules',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Requests/UpdateSegmentRequest.php' => 
    array (
      0 => 'd8efea4760204c53573412d3e9cd611946a8e0a1',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\updatesegmentrequest',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\authorize',
        1 => 'app\\domains\\leads\\http\\requests\\rules',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Requests/StoreLeadRequest.php' => 
    array (
      0 => '4525e0734c97718249bcd5c1e5bb979a84e2fa93',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\storeleadrequest',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\authorize',
        1 => 'app\\domains\\leads\\http\\requests\\rules',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Requests/StoreLeadCustomFieldRequest.php' => 
    array (
      0 => '9c4ef41fdacf66923234a8e47e8ad491b2b5ed28',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\storeleadcustomfieldrequest',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\authorize',
        1 => 'app\\domains\\leads\\http\\requests\\rules',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Requests/UpdateLeadHistoryRequest.php' => 
    array (
      0 => 'bca467470a0dda3c617de13c1ddca7baba8e1826',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\updateleadhistoryrequest',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\authorize',
        1 => 'app\\domains\\leads\\http\\requests\\rules',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Requests/UpdateLeadScoreRequest.php' => 
    array (
      0 => '725b7074732bb6363ae700bbc98020d8481c1b55',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\updateleadscorerequest',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\authorize',
        1 => 'app\\domains\\leads\\http\\requests\\rules',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Requests/UpdateLeadTagsRequest.php' => 
    array (
      0 => '528271243d9213480db96cdb2746af9310bc9a1f',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\updateleadtagsrequest',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\authorize',
        1 => 'app\\domains\\leads\\http\\requests\\rules',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Requests/ImportLeadsRequest.php' => 
    array (
      0 => '9cfa1245b4638c8d309893bb5859227bb1b60719',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\importleadsrequest',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\authorize',
        1 => 'app\\domains\\leads\\http\\requests\\rules',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Requests/StoreSegmentRequest.php' => 
    array (
      0 => '4752817bbe714c82366fe8262726b86a1f84698c',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\storesegmentrequest',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\authorize',
        1 => 'app\\domains\\leads\\http\\requests\\rules',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Requests/UpdateLeadCustomFieldRequest.php' => 
    array (
      0 => '2c9dd039536526207cc58081c352b03e4a363bd2',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\updateleadcustomfieldrequest',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\authorize',
        1 => 'app\\domains\\leads\\http\\requests\\rules',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Requests/UpdateLeadStatusRequest.php' => 
    array (
      0 => 'dd6782ed9a179c6856324243ddac9124789b5d7e',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\updateleadstatusrequest',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\requests\\authorize',
        1 => 'app\\domains\\leads\\http\\requests\\rules',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/routes.php' => 
    array (
      0 => 'b10b99c16527b2e701c2abb25c46eb94deb039fd',
      1 => 
      array (
      ),
      2 => 
      array (
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Controllers/LeadHistoryController.php' => 
    array (
      0 => '60451835e8634789cf5a3ec08f39f55eb9ca2672',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\controllers\\leadhistorycontroller',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\controllers\\__construct',
        1 => 'app\\domains\\leads\\http\\controllers\\index',
        2 => 'app\\domains\\leads\\http\\controllers\\show',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Controllers/SegmentController.php' => 
    array (
      0 => 'bd5efd083abad000d2db6b328c9e411c11ec104f',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\controllers\\segmentcontroller',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\controllers\\__construct',
        1 => 'app\\domains\\leads\\http\\controllers\\index',
        2 => 'app\\domains\\leads\\http\\controllers\\store',
        3 => 'app\\domains\\leads\\http\\controllers\\show',
        4 => 'app\\domains\\leads\\http\\controllers\\update',
        5 => 'app\\domains\\leads\\http\\controllers\\destroy',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Controllers/LeadController.php' => 
    array (
      0 => 'b1659bebb644c50eb40c035601649477ea240740',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\controllers\\leadcontroller',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\controllers\\__construct',
        1 => 'app\\domains\\leads\\http\\controllers\\index',
        2 => 'app\\domains\\leads\\http\\controllers\\store',
        3 => 'app\\domains\\leads\\http\\controllers\\show',
        4 => 'app\\domains\\leads\\http\\controllers\\update',
        5 => 'app\\domains\\leads\\http\\controllers\\destroy',
        6 => 'app\\domains\\leads\\http\\controllers\\search',
        7 => 'app\\domains\\leads\\http\\controllers\\getbystatus',
        8 => 'app\\domains\\leads\\http\\controllers\\getbysource',
        9 => 'app\\domains\\leads\\http\\controllers\\getbysegment',
        10 => 'app\\domains\\leads\\http\\controllers\\getstats',
        11 => 'app\\domains\\leads\\http\\controllers\\getcounts',
        12 => 'app\\domains\\leads\\http\\controllers\\getrecent',
        13 => 'app\\domains\\leads\\http\\controllers\\getbyscore',
        14 => 'app\\domains\\leads\\http\\controllers\\updatestatus',
        15 => 'app\\domains\\leads\\http\\controllers\\qualify',
        16 => 'app\\domains\\leads\\http\\controllers\\disqualify',
        17 => 'app\\domains\\leads\\http\\controllers\\convert',
        18 => 'app\\domains\\leads\\http\\controllers\\lose',
        19 => 'app\\domains\\leads\\http\\controllers\\contact',
        20 => 'app\\domains\\leads\\http\\controllers\\negotiate',
        21 => 'app\\domains\\leads\\http\\controllers\\followup',
        22 => 'app\\domains\\leads\\http\\controllers\\getstatushistory',
        23 => 'app\\domains\\leads\\http\\controllers\\getstatusstats',
        24 => 'app\\domains\\leads\\http\\controllers\\getconversionrate',
        25 => 'app\\domains\\leads\\http\\controllers\\getleadsneedingfollowup',
        26 => 'app\\domains\\leads\\http\\controllers\\getleadsinnegotiation',
        27 => 'app\\domains\\leads\\http\\controllers\\getqualifiedleads',
        28 => 'app\\domains\\leads\\http\\controllers\\getconvertedleads',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Controllers/LeadStatusController.php' => 
    array (
      0 => '06c7c1a3a0b2708b32bad1e352a96636db9a4c8a',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\controllers\\leadstatuscontroller',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\controllers\\__construct',
        1 => 'app\\domains\\leads\\http\\controllers\\updatestatus',
        2 => 'app\\domains\\leads\\http\\controllers\\qualify',
        3 => 'app\\domains\\leads\\http\\controllers\\disqualify',
        4 => 'app\\domains\\leads\\http\\controllers\\convert',
        5 => 'app\\domains\\leads\\http\\controllers\\lose',
        6 => 'app\\domains\\leads\\http\\controllers\\contact',
        7 => 'app\\domains\\leads\\http\\controllers\\negotiate',
        8 => 'app\\domains\\leads\\http\\controllers\\followup',
        9 => 'app\\domains\\leads\\http\\controllers\\getstatushistory',
        10 => 'app\\domains\\leads\\http\\controllers\\getstatusstats',
        11 => 'app\\domains\\leads\\http\\controllers\\getconversionrate',
        12 => 'app\\domains\\leads\\http\\controllers\\getleadsbystatus',
        13 => 'app\\domains\\leads\\http\\controllers\\getleadsneedingfollowup',
        14 => 'app\\domains\\leads\\http\\controllers\\getleadsinnegotiation',
        15 => 'app\\domains\\leads\\http\\controllers\\getqualifiedleads',
        16 => 'app\\domains\\leads\\http\\controllers\\getconvertedleads',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Controllers/LeadManagementController.php' => 
    array (
      0 => 'aa87ad01f7a2db970054fa8f8d24a78b139b1cf4',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\controllers\\leadmanagementcontroller',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\controllers\\__construct',
        1 => 'app\\domains\\leads\\http\\controllers\\getprojectid',
        2 => 'app\\domains\\leads\\http\\controllers\\renderleadspage',
        3 => 'app\\domains\\leads\\http\\controllers\\index',
        4 => 'app\\domains\\leads\\http\\controllers\\store',
        5 => 'app\\domains\\leads\\http\\controllers\\show',
        6 => 'app\\domains\\leads\\http\\controllers\\update',
        7 => 'app\\domains\\leads\\http\\controllers\\destroy',
        8 => 'app\\domains\\leads\\http\\controllers\\search',
        9 => 'app\\domains\\leads\\http\\controllers\\getbystatus',
        10 => 'app\\domains\\leads\\http\\controllers\\getbysource',
        11 => 'app\\domains\\leads\\http\\controllers\\getbysegment',
        12 => 'app\\domains\\leads\\http\\controllers\\getstats',
        13 => 'app\\domains\\leads\\http\\controllers\\getcounts',
        14 => 'app\\domains\\leads\\http\\controllers\\exists',
        15 => 'app\\domains\\leads\\http\\controllers\\getrecent',
        16 => 'app\\domains\\leads\\http\\controllers\\getbyscore',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Controllers/LeadCustomFieldController.php' => 
    array (
      0 => 'a46c4512a377324816ba30bd272eccea48ef8d3b',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\controllers\\leadcustomfieldcontroller',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\controllers\\__construct',
        1 => 'app\\domains\\leads\\http\\controllers\\index',
        2 => 'app\\domains\\leads\\http\\controllers\\store',
        3 => 'app\\domains\\leads\\http\\controllers\\show',
        4 => 'app\\domains\\leads\\http\\controllers\\update',
        5 => 'app\\domains\\leads\\http\\controllers\\destroy',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Http/Controllers/CategorizationController.php' => 
    array (
      0 => '05faac84f73581745a8adeca3065c34a2fdec2e4',
      1 => 
      array (
        0 => 'app\\domains\\leads\\http\\controllers\\categorizationcontroller',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\http\\controllers\\__construct',
        1 => 'app\\domains\\leads\\http\\controllers\\getleadscore',
        2 => 'app\\domains\\leads\\http\\controllers\\getleadsegments',
        3 => 'app\\domains\\leads\\http\\controllers\\updateleadscore',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Activities/CalculateNextActionActivity.php' => 
    array (
      0 => '96b19b124bfd62d1bdb7cef37453fbf392843e2c',
      1 => 
      array (
        0 => 'app\\domains\\leads\\activities\\calculatenextactionactivity',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\activities\\__construct',
        1 => 'app\\domains\\leads\\activities\\execute',
        2 => 'app\\domains\\leads\\activities\\getnextemailtemplate',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Activities/ScheduleFollowUpActivity.php' => 
    array (
      0 => '161f07f532da9d675a78bde7d72224516882dcfc',
      1 => 
      array (
        0 => 'app\\domains\\leads\\activities\\schedulefollowupactivity',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\activities\\__construct',
        1 => 'app\\domains\\leads\\activities\\execute',
        2 => 'app\\domains\\leads\\activities\\createfollowuptask',
        3 => 'app\\domains\\leads\\activities\\buildtaskdescription',
        4 => 'app\\domains\\leads\\activities\\determinetaskpriority',
        5 => 'app\\domains\\leads\\activities\\sendfollowupnotification',
        6 => 'app\\domains\\leads\\activities\\updateleadfollowupdate',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Activities/ValidateRowsActivity.php' => 
    array (
      0 => '58187cf5d82804b8d9585d54845324e66e11b0b4',
      1 => 
      array (
        0 => 'app\\domains\\leads\\activities\\validaterowsactivity',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\activities\\execute',
        1 => 'app\\domains\\leads\\activities\\validaterow',
        2 => 'app\\domains\\leads\\activities\\getdefaultvalidationrules',
        3 => 'app\\domains\\leads\\activities\\getcustommessages',
        4 => 'app\\domains\\leads\\activities\\validatebusinessrules',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Activities/CheckEngagementActivity.php' => 
    array (
      0 => '26bfad07941dc27e891b717ad84d870d188b1259',
      1 => 
      array (
        0 => 'app\\domains\\leads\\activities\\checkengagementactivity',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\activities\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Queries/GetLeadAnalyticsQuery.php' => 
    array (
      0 => 'bf6c1289ef695533c601f35f69a6adebdbcdd084',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\queries\\getleadanalyticsquery',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\queries\\__construct',
        1 => 'app\\domains\\leads\\application\\queries\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Queries/ListLeadsQuery.php' => 
    array (
      0 => '4ec07e98a62400fe57b7fc4a8e82062f88e7564a',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\queries\\listleadsquery',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\queries\\__construct',
        1 => 'app\\domains\\leads\\application\\queries\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Queries/GetLeadActivitiesQuery.php' => 
    array (
      0 => 'a2d465e803de20f4d26a26e69a6a6f0261515eb8',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\queries\\getleadactivitiesquery',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\queries\\__construct',
        1 => 'app\\domains\\leads\\application\\queries\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Queries/GetLeadQuery.php' => 
    array (
      0 => 'affc7576fceb1afc2d2926d1171e1a8f16ad881e',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\queries\\getleadquery',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\queries\\__construct',
        1 => 'app\\domains\\leads\\application\\queries\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Queries/GetLeadByEmailQuery.php' => 
    array (
      0 => 'f54881e626810eb21037006bf403e902acde5eb8',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\queries\\getleadbyemailquery',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\queries\\__construct',
        1 => 'app\\domains\\leads\\application\\queries\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Commands/UpdateLeadCommand.php' => 
    array (
      0 => 'b86deec12299304d9d07c798faf956272fee2ed2',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\commands\\updateleadcommand',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\commands\\__construct',
        1 => 'app\\domains\\leads\\application\\commands\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Commands/AssignLeadCommand.php' => 
    array (
      0 => '04ce12fc1f8a2caa017633cf6809961f08fd5975',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\commands\\assignleadcommand',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\commands\\__construct',
        1 => 'app\\domains\\leads\\application\\commands\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Commands/DeleteLeadCommand.php' => 
    array (
      0 => '2ae629ab300f966b13a7bdf393b7c48c994ca288',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\commands\\deleteleadcommand',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\commands\\__construct',
        1 => 'app\\domains\\leads\\application\\commands\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Commands/ConvertLeadCommand.php' => 
    array (
      0 => '063a5aba3c6c49a17b444593e980a9b19a283edf',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\commands\\convertleadcommand',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\commands\\__construct',
        1 => 'app\\domains\\leads\\application\\commands\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Commands/UpdateLeadScoreCommand.php' => 
    array (
      0 => '65180497685f4155a349f0dfac4e5e6d76d76c1d',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\commands\\updateleadscorecommand',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\commands\\__construct',
        1 => 'app\\domains\\leads\\application\\commands\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Commands/CreateLeadCommand.php' => 
    array (
      0 => 'd1a017310325d432749a68af123d4f4c60b4608a',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\commands\\createleadcommand',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\commands\\__construct',
        1 => 'app\\domains\\leads\\application\\commands\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Handlers/GetLeadHandler.php' => 
    array (
      0 => 'dc6f647f1f0cf19558d5986536c80f3227b47737',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\getleadhandler',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\__construct',
        1 => 'app\\domains\\leads\\application\\handlers\\handle',
        2 => 'app\\domains\\leads\\application\\handlers\\validatequery',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Handlers/GetLeadByEmailHandler.php' => 
    array (
      0 => 'a48252df27b1f03bae9c2d15150400631fcd9a50',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\getleadbyemailhandler',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\__construct',
        1 => 'app\\domains\\leads\\application\\handlers\\handle',
        2 => 'app\\domains\\leads\\application\\handlers\\validatequery',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Handlers/UpdateLeadScoreHandler.php' => 
    array (
      0 => '693ae7874888ebfdad7d57e43e8d332491568f86',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\updateleadscorehandler',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\__construct',
        1 => 'app\\domains\\leads\\application\\handlers\\handle',
        2 => 'app\\domains\\leads\\application\\handlers\\validatecommand',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Handlers/CreateLeadHandler.php' => 
    array (
      0 => '1b6a33d744b06d71aad354c9183e790db14c14e7',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\createleadhandler',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\__construct',
        1 => 'app\\domains\\leads\\application\\handlers\\handle',
        2 => 'app\\domains\\leads\\application\\handlers\\validatecommand',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Handlers/ListLeadsHandler.php' => 
    array (
      0 => '5f711cb43959eba4f85d72de062d71ab67664980',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\listleadshandler',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\__construct',
        1 => 'app\\domains\\leads\\application\\handlers\\handle',
        2 => 'app\\domains\\leads\\application\\handlers\\validatequery',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Handlers/GetLeadAnalyticsHandler.php' => 
    array (
      0 => '89ca0e9cee1fb5aa4fb991b3eb9f7daec0fdf718',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\getleadanalyticshandler',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\__construct',
        1 => 'app\\domains\\leads\\application\\handlers\\handle',
        2 => 'app\\domains\\leads\\application\\handlers\\validatequery',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Handlers/UpdateLeadHandler.php' => 
    array (
      0 => '1b2f2c5163be245851c68f6d92686a9c560104e2',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\updateleadhandler',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\__construct',
        1 => 'app\\domains\\leads\\application\\handlers\\handle',
        2 => 'app\\domains\\leads\\application\\handlers\\validatecommand',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Handlers/AssignLeadHandler.php' => 
    array (
      0 => 'f576b5eec961c01bbd069ff15ffa5dd57d7e79bf',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\assignleadhandler',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\__construct',
        1 => 'app\\domains\\leads\\application\\handlers\\handle',
        2 => 'app\\domains\\leads\\application\\handlers\\validatecommand',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Handlers/DeleteLeadHandler.php' => 
    array (
      0 => '66333dd3fab3a4dd122e09c4c13b34545641e8ca',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\deleteleadhandler',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\__construct',
        1 => 'app\\domains\\leads\\application\\handlers\\handle',
        2 => 'app\\domains\\leads\\application\\handlers\\validatecommand',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Handlers/GetLeadActivitiesHandler.php' => 
    array (
      0 => 'eaef4ccd99ef174d3cf3fba67f804bd8f482cb4c',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\getleadactivitieshandler',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\__construct',
        1 => 'app\\domains\\leads\\application\\handlers\\handle',
        2 => 'app\\domains\\leads\\application\\handlers\\validatequery',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Handlers/ConvertLeadHandler.php' => 
    array (
      0 => 'd353b9a6bd62db37e5d97f6411df6d46fabee39b',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\convertleadhandler',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\handlers\\__construct',
        1 => 'app\\domains\\leads\\application\\handlers\\handle',
        2 => 'app\\domains\\leads\\application\\handlers\\validatecommand',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/UseCases/CreateLeadUseCase.php' => 
    array (
      0 => '2e03c577d3a05392cb0a97db74ef8e9a180c7e6b',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\usecases\\createleadusecase',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\usecases\\__construct',
        1 => 'app\\domains\\leads\\application\\usecases\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/UseCases/ListLeadsUseCase.php' => 
    array (
      0 => '17cc39874419126facb539d123ea4dd5a8c33271',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\usecases\\listleadsusecase',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\usecases\\__construct',
        1 => 'app\\domains\\leads\\application\\usecases\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/UseCases/GetLeadByEmailUseCase.php' => 
    array (
      0 => 'd88a1b24435a68bf13ed4612d06a2b6afd8bbd36',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\usecases\\getleadbyemailusecase',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\usecases\\__construct',
        1 => 'app\\domains\\leads\\application\\usecases\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/UseCases/GetLeadUseCase.php' => 
    array (
      0 => '8ef89c1ae211d91073fe4fe3851a919a89dd1105',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\usecases\\getleadusecase',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\usecases\\__construct',
        1 => 'app\\domains\\leads\\application\\usecases\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/UseCases/UpdateLeadScoreUseCase.php' => 
    array (
      0 => 'aa8184415b47a22faaf23565b397b98fd9ec2afc',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\usecases\\updateleadscoreusecase',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\usecases\\__construct',
        1 => 'app\\domains\\leads\\application\\usecases\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/UseCases/GetLeadActivitiesUseCase.php' => 
    array (
      0 => '6a76de3fb5469bc53d9845dac33893837a8e3c98',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\usecases\\getleadactivitiesusecase',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\usecases\\__construct',
        1 => 'app\\domains\\leads\\application\\usecases\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/UseCases/ConvertLeadUseCase.php' => 
    array (
      0 => '1367b2bd287c4705d7071e235d0bd401b416669f',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\usecases\\convertleadusecase',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\usecases\\__construct',
        1 => 'app\\domains\\leads\\application\\usecases\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/UseCases/UpdateLeadUseCase.php' => 
    array (
      0 => '72fed23c1ee58bd90dd469df0b4a96f566a1b26f',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\usecases\\updateleadusecase',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\usecases\\__construct',
        1 => 'app\\domains\\leads\\application\\usecases\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/UseCases/AssignLeadUseCase.php' => 
    array (
      0 => 'd5aac8834eb5789150b19ec8a008da6e3e1939db',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\usecases\\assignleadusecase',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\usecases\\__construct',
        1 => 'app\\domains\\leads\\application\\usecases\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/UseCases/DeleteLeadUseCase.php' => 
    array (
      0 => 'b90f551369db4ecfdc8f95ff3dd39127d6be03fe',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\usecases\\deleteleadusecase',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\usecases\\__construct',
        1 => 'app\\domains\\leads\\application\\usecases\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Application/Services/LeadsApplicationService.php' => 
    array (
      0 => '2158e351f25c3e8dd187fc8ec2c83d5e8733e34a',
      1 => 
      array (
        0 => 'app\\domains\\leads\\application\\services\\leadsapplicationservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\application\\services\\__construct',
        1 => 'app\\domains\\leads\\application\\services\\createlead',
        2 => 'app\\domains\\leads\\application\\services\\updatelead',
        3 => 'app\\domains\\leads\\application\\services\\deletelead',
        4 => 'app\\domains\\leads\\application\\services\\assignlead',
        5 => 'app\\domains\\leads\\application\\services\\convertlead',
        6 => 'app\\domains\\leads\\application\\services\\getlead',
        7 => 'app\\domains\\leads\\application\\services\\listleads',
        8 => 'app\\domains\\leads\\application\\services\\getleadbyemail',
        9 => 'app\\domains\\leads\\application\\services\\getleadactivities',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Jobs/ProcessScoreDecayJob.php' => 
    array (
      0 => '6084b354be20e6b233795d9fd3bf03c2e6aba357',
      1 => 
      array (
        0 => 'app\\domains\\leads\\jobs\\processscoredecayjob',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\jobs\\__construct',
        1 => 'app\\domains\\leads\\jobs\\handle',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Jobs/ProcessSegmentationJob.php' => 
    array (
      0 => 'ff5fa3e6b1a65f01ea58a0d0d76af92a48a44125',
      1 => 
      array (
        0 => 'app\\domains\\leads\\jobs\\processsegmentationjob',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\jobs\\__construct',
        1 => 'app\\domains\\leads\\jobs\\handle',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadDeleted.php' => 
    array (
      0 => '9143c72ebd0e03f12d17d6fc6ea516875e755101',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leaddeleted',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadCustomFieldDeleted.php' => 
    array (
      0 => 'af36497d2cf554add3d497cb39efc753379b6274',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leadcustomfielddeleted',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadHistoryCreated.php' => 
    array (
      0 => '094975e9e2745869262420baeddffa90690a26e8',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leadhistorycreated',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/SegmentCreated.php' => 
    array (
      0 => '79c9eaaf713e6768a7878c6c0cebb59763ce6dca',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\segmentcreated',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadTagsUpdated.php' => 
    array (
      0 => '4be7d0caeb717b055af31e7ccdf62165552b6312',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leadtagsupdated',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadEmailClicked.php' => 
    array (
      0 => '450ee92909a7b7cd7bb4415126cbf32fb23f48f0',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leademailclicked',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadCustomValueDeleted.php' => 
    array (
      0 => '1775dc1c8e4fc568f183a6edd8759a4273158c54',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leadcustomvaluedeleted',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/SegmentUpdated.php' => 
    array (
      0 => '753225a9bcd520f10d9a7c4fd402de0c49747f77',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\segmentupdated',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadSegmentsSynchronized.php' => 
    array (
      0 => 'c422e971d4951a927037be6f564215e9c5d574f8',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leadsegmentssynchronized',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadExported.php' => 
    array (
      0 => '3f8cec155e3996081ea7681c38f427ed9fe1d8b9',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leadexported',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadCreated.php' => 
    array (
      0 => '22b44a9c2345e2a803db4a07d9b6f588c2b263f9',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leadcreated',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadCustomFieldCreated.php' => 
    array (
      0 => '6d98c3dc75d1174c2b7b09121387daf2fb0d034c',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leadcustomfieldcreated',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadScoresDecayed.php' => 
    array (
      0 => 'ba391d66238e4d4a30926a50e619cef0ebdb12aa',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leadscoresdecayed',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadStatusUpdated.php' => 
    array (
      0 => 'e3a9df89580ff1b4a1f0a36a0651814f5c999f5b',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leadstatusupdated',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/SegmentDeleted.php' => 
    array (
      0 => 'cd76fbba25baf9ab8aec5029ce6eb8be625b43a6',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\segmentdeleted',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadCustomValueUpdated.php' => 
    array (
      0 => '1b606adddc35b58fc10f7d43bef2a91fa412bf66',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leadcustomvalueupdated',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadActivityRecorded.php' => 
    array (
      0 => '51056587b7cf4b79e6c43c7276d8bdd4ee5a5ed2',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leadactivityrecorded',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadCaptured.php' => 
    array (
      0 => 'bfa8dcbaec15ca29a7c116ca3fbff5d807ffe691',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leadcaptured',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadStatusChanged.php' => 
    array (
      0 => '739694e0fe1377c1821d1957390b281a20b9bc9d',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leadstatuschanged',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadEmailSent.php' => 
    array (
      0 => 'e72c0656aed6d6fc2d61ef1bb49875ed78a03b5d',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leademailsent',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadCustomFieldUpdated.php' => 
    array (
      0 => 'c3ad1949efdce704f3be55e99ea17e9109b9b460',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leadcustomfieldupdated',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadUpdated.php' => 
    array (
      0 => '65eca3d48348d280e1161043bfd894fc29f2647e',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leadupdated',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/SegmentProcessed.php' => 
    array (
      0 => 'b96163ece87b7bf42e99d22a34b334c5d0597c20',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\segmentprocessed',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadImported.php' => 
    array (
      0 => '435588d4e6bdc7cca68acddb921b440519e4cde7',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leadimported',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadEmailOpened.php' => 
    array (
      0 => '1d2519a38c4fb8c2e313b24b6082e77a10adedb4',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leademailopened',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadCustomValueCreated.php' => 
    array (
      0 => '355d8efe518a391c128d115a925d2da712e47864',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leadcustomvaluecreated',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Events/LeadScoreUpdated.php' => 
    array (
      0 => 'e07b61274efdfb14a8e5e304ed2b8abdfa486fe6',
      1 => 
      array (
        0 => 'app\\domains\\leads\\events\\leadscoreupdated',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Infrastructure/Persistence/Eloquent/LeadCustomValueModel.php' => 
    array (
      0 => '8e982dc9514888be26b1f2b8da1cae2624fe7b0b',
      1 => 
      array (
        0 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\leadcustomvaluemodel',
      ),
      2 => 
      array (
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Infrastructure/Persistence/Eloquent/LeadCustomValueRepository.php' => 
    array (
      0 => 'f90461276b441ba2d3d326b4689d21f0fef3a9a9',
      1 => 
      array (
        0 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\leadcustomvaluerepository',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\__construct',
        1 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\create',
        2 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\find',
        3 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\update',
        4 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\delete',
        5 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\getbyleadid',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Infrastructure/Persistence/Eloquent/SegmentModel.php' => 
    array (
      0 => 'df38cb89126eef1059a915621d9f8857c7024283',
      1 => 
      array (
        0 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\segmentmodel',
      ),
      2 => 
      array (
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Infrastructure/Persistence/Eloquent/LeadHistoryModel.php' => 
    array (
      0 => '386d5592a758fb28cc48c8c302ebcf5549457f08',
      1 => 
      array (
        0 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\leadhistorymodel',
      ),
      2 => 
      array (
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Infrastructure/Persistence/Eloquent/LeadCustomFieldRepository.php' => 
    array (
      0 => '057f6269fad56b45d099223baf97a3a8477efcc0',
      1 => 
      array (
        0 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\leadcustomfieldrepository',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\__construct',
        1 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\create',
        2 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\find',
        3 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\update',
        4 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\delete',
        5 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\getpaginatedforuser',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Infrastructure/Persistence/Eloquent/SegmentRepository.php' => 
    array (
      0 => 'b28b9376a0ee753bff73a8f5f741015a4f9bae95',
      1 => 
      array (
        0 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\segmentrepository',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\__construct',
        1 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\create',
        2 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\find',
        3 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\update',
        4 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\delete',
        5 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\getpaginatedforuser',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Infrastructure/Persistence/Eloquent/LeadEmailRepository.php' => 
    array (
      0 => 'a672b85334cec4bf628e564a27af13192b4c6e27',
      1 => 
      array (
        0 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\leademailrepository',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\__construct',
        1 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\create',
        2 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\find',
        3 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\getbyleadid',
        4 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\markasopened',
        5 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\markasclicked',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Infrastructure/Persistence/Eloquent/LeadRepository.php' => 
    array (
      0 => 'cf2663f88934e5b4b0e77f664667079822e8f184',
      1 => 
      array (
        0 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\leadrepository',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\__construct',
        1 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\create',
        2 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\find',
        3 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\findbyemail',
        4 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\update',
        5 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\delete',
        6 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\getallpaginated',
        7 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\paginate',
        8 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\buildquery',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Infrastructure/Persistence/Eloquent/LeadEmailModel.php' => 
    array (
      0 => '410803ac8d8b8827dfbbbd3eeceafb6f59197ef1',
      1 => 
      array (
        0 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\leademailmodel',
      ),
      2 => 
      array (
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Infrastructure/Persistence/Eloquent/LeadHistoryRepository.php' => 
    array (
      0 => '9e620d4fe8baa7fa3a01c18502cc8bba9b0c78c7',
      1 => 
      array (
        0 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\leadhistoryrepository',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\__construct',
        1 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\create',
        2 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\find',
        3 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\getbyleadid',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Infrastructure/Persistence/Eloquent/LeadModel.php' => 
    array (
      0 => 'df744b8f11dd10aec0a4941a052825565abf0b72',
      1 => 
      array (
        0 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\leadmodel',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\assignedto',
        1 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\project',
        2 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\scopebystatus',
        3 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\scopebysource',
        4 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\scopehighscore',
        5 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\todomainentity',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Infrastructure/Persistence/Eloquent/LeadCustomFieldModel.php' => 
    array (
      0 => '2f43c384dd732be6a5174d7e2ac33ca62c893acb',
      1 => 
      array (
        0 => 'app\\domains\\leads\\infrastructure\\persistence\\eloquent\\leadcustomfieldmodel',
      ),
      2 => 
      array (
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Domain/Segment.php' => 
    array (
      0 => '1cd58d3b28746dc7d7261f75965c9c93c1158827',
      1 => 
      array (
        0 => 'app\\domains\\leads\\domain\\segment',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\domain\\__construct',
        1 => 'app\\domains\\leads\\domain\\fromarray',
        2 => 'app\\domains\\leads\\domain\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Domain/LeadCustomValueRepositoryInterface.php' => 
    array (
      0 => '8dbd712f9f66faba289ca79089872cbf09530b03',
      1 => 
      array (
        0 => 'app\\domains\\leads\\domain\\leadcustomvaluerepositoryinterface',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\domain\\create',
        1 => 'app\\domains\\leads\\domain\\find',
        2 => 'app\\domains\\leads\\domain\\update',
        3 => 'app\\domains\\leads\\domain\\delete',
        4 => 'app\\domains\\leads\\domain\\getbyleadid',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Domain/LeadRepositoryInterface.php' => 
    array (
      0 => '9f5fb7bb297f473942e2e0130cf28ed909c93456',
      1 => 
      array (
        0 => 'app\\domains\\leads\\domain\\leadrepositoryinterface',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\domain\\find',
        1 => 'app\\domains\\leads\\domain\\findbyprojectid',
        2 => 'app\\domains\\leads\\domain\\create',
        3 => 'app\\domains\\leads\\domain\\update',
        4 => 'app\\domains\\leads\\domain\\delete',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Domain/SegmentRepositoryInterface.php' => 
    array (
      0 => 'c9523b36324cb0155cab109e2db42289fb6c76c4',
      1 => 
      array (
        0 => 'app\\domains\\leads\\domain\\segmentrepositoryinterface',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\domain\\create',
        1 => 'app\\domains\\leads\\domain\\find',
        2 => 'app\\domains\\leads\\domain\\update',
        3 => 'app\\domains\\leads\\domain\\delete',
        4 => 'app\\domains\\leads\\domain\\getpaginatedforuser',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Domain/LeadCustomValue.php' => 
    array (
      0 => '65783d95528b682e379e38819e6444e814b92ecf',
      1 => 
      array (
        0 => 'app\\domains\\leads\\domain\\leadcustomvalue',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\domain\\__construct',
        1 => 'app\\domains\\leads\\domain\\fromarray',
        2 => 'app\\domains\\leads\\domain\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Domain/LeadCustomFieldRepositoryInterface.php' => 
    array (
      0 => '8076b4962014b9f0eccc3da71a438fbb79de75ec',
      1 => 
      array (
        0 => 'app\\domains\\leads\\domain\\leadcustomfieldrepositoryinterface',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\domain\\create',
        1 => 'app\\domains\\leads\\domain\\find',
        2 => 'app\\domains\\leads\\domain\\update',
        3 => 'app\\domains\\leads\\domain\\delete',
        4 => 'app\\domains\\leads\\domain\\getpaginatedforuser',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Domain/LeadCustomField.php' => 
    array (
      0 => 'b905adbba49458f54aee0ea94651e037c9fe85ae',
      1 => 
      array (
        0 => 'app\\domains\\leads\\domain\\leadcustomfield',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\domain\\__construct',
        1 => 'app\\domains\\leads\\domain\\fromarray',
        2 => 'app\\domains\\leads\\domain\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Domain/LeadEmail.php' => 
    array (
      0 => '3a44312a83aab2f4cc708b3f7d401d503d9c8759',
      1 => 
      array (
        0 => 'app\\domains\\leads\\domain\\leademail',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\domain\\__construct',
        1 => 'app\\domains\\leads\\domain\\fromarray',
        2 => 'app\\domains\\leads\\domain\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Domain/LeadHistory.php' => 
    array (
      0 => '667910ca41d2bf2638e4fa595d695b42a548a7d8',
      1 => 
      array (
        0 => 'app\\domains\\leads\\domain\\leadhistory',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\domain\\__construct',
        1 => 'app\\domains\\leads\\domain\\fromarray',
        2 => 'app\\domains\\leads\\domain\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Domain/LeadHistoryRepositoryInterface.php' => 
    array (
      0 => '9913653ab0a4d370366a390745c94b60ccaaa0bc',
      1 => 
      array (
        0 => 'app\\domains\\leads\\domain\\leadhistoryrepositoryinterface',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\domain\\create',
        1 => 'app\\domains\\leads\\domain\\find',
        2 => 'app\\domains\\leads\\domain\\getbyleadid',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Domain/LeadEmailRepositoryInterface.php' => 
    array (
      0 => '67aa6a2aec0d054eb872c7e7162ef083645022cc',
      1 => 
      array (
        0 => 'app\\domains\\leads\\domain\\leademailrepositoryinterface',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\domain\\create',
        1 => 'app\\domains\\leads\\domain\\find',
        2 => 'app\\domains\\leads\\domain\\getbyleadid',
        3 => 'app\\domains\\leads\\domain\\markasopened',
        4 => 'app\\domains\\leads\\domain\\markasclicked',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Domain/Lead.php' => 
    array (
      0 => '1c0e7b06ec192a028c11659e3e3f70bad9d359c5',
      1 => 
      array (
        0 => 'app\\domains\\leads\\domain\\lead',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\domain\\__construct',
        1 => 'app\\domains\\leads\\domain\\fromarray',
        2 => 'app\\domains\\leads\\domain\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Observers/SegmentObserver.php' => 
    array (
      0 => '568aa9f507d1c5bd196aafadea57368a9d74930d',
      1 => 
      array (
        0 => 'app\\domains\\leads\\observers\\segmentobserver',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\observers\\created',
        1 => 'app\\domains\\leads\\observers\\updated',
        2 => 'app\\domains\\leads\\observers\\deleted',
        3 => 'app\\domains\\leads\\observers\\restored',
        4 => 'app\\domains\\leads\\observers\\forcedeleted',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Observers/LeadObserver.php' => 
    array (
      0 => 'f07080429022569f15ce5f56fb7b3de5f90717ce',
      1 => 
      array (
        0 => 'app\\domains\\leads\\observers\\leadobserver',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\observers\\created',
        1 => 'app\\domains\\leads\\observers\\updated',
        2 => 'app\\domains\\leads\\observers\\deleted',
        3 => 'app\\domains\\leads\\observers\\restored',
        4 => 'app\\domains\\leads\\observers\\forcedeleted',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Observers/LeadEmailObserver.php' => 
    array (
      0 => 'bdb9a82461a8c6b522820d884f48a24dfaae9c4a',
      1 => 
      array (
        0 => 'app\\domains\\leads\\observers\\leademailobserver',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\observers\\created',
        1 => 'app\\domains\\leads\\observers\\updated',
        2 => 'app\\domains\\leads\\observers\\deleted',
        3 => 'app\\domains\\leads\\observers\\restored',
        4 => 'app\\domains\\leads\\observers\\forcedeleted',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Observers/LeadCustomValueObserver.php' => 
    array (
      0 => 'c947bdb63470cc97759c55605bb1519ae4e3d68e',
      1 => 
      array (
        0 => 'app\\domains\\leads\\observers\\leadcustomvalueobserver',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\observers\\created',
        1 => 'app\\domains\\leads\\observers\\updated',
        2 => 'app\\domains\\leads\\observers\\deleted',
        3 => 'app\\domains\\leads\\observers\\restored',
        4 => 'app\\domains\\leads\\observers\\forcedeleted',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Observers/LeadHistoryObserver.php' => 
    array (
      0 => 'c50d925340cc58c10d83cbfab572710527471110',
      1 => 
      array (
        0 => 'app\\domains\\leads\\observers\\leadhistoryobserver',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\observers\\created',
        1 => 'app\\domains\\leads\\observers\\updated',
        2 => 'app\\domains\\leads\\observers\\deleted',
        3 => 'app\\domains\\leads\\observers\\restored',
        4 => 'app\\domains\\leads\\observers\\forcedeleted',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Observers/LeadCustomFieldObserver.php' => 
    array (
      0 => '804d5db513e8b649953f547a482a5396abcac69a',
      1 => 
      array (
        0 => 'app\\domains\\leads\\observers\\leadcustomfieldobserver',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\observers\\created',
        1 => 'app\\domains\\leads\\observers\\updated',
        2 => 'app\\domains\\leads\\observers\\deleted',
        3 => 'app\\domains\\leads\\observers\\restored',
        4 => 'app\\domains\\leads\\observers\\forcedeleted',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Listeners/RecordLeadStatusChange.php' => 
    array (
      0 => 'f4784856fb3ec071233968417dd3131ca12b2ee0',
      1 => 
      array (
        0 => 'app\\domains\\leads\\listeners\\recordleadstatuschange',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\listeners\\__construct',
        1 => 'app\\domains\\leads\\listeners\\handle',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Listeners/ProcessLeadWorkflows.php' => 
    array (
      0 => 'f49add81e35f60e64632afc59f7401f44374694e',
      1 => 
      array (
        0 => 'app\\domains\\leads\\listeners\\processleadworkflows',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\listeners\\__construct',
        1 => 'app\\domains\\leads\\listeners\\handleleadcreated',
        2 => 'app\\domains\\leads\\listeners\\handleleadstatuschanged',
        3 => 'app\\domains\\leads\\listeners\\handleleadscoreupdated',
        4 => 'app\\domains\\leads\\listeners\\subscribe',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Listeners/UpdateChatStatusListener.php' => 
    array (
      0 => '8fb4c4dcd2913626b1ca55c8ac2c5497eead75d4',
      1 => 
      array (
        0 => 'app\\domains\\leads\\listeners\\updatechatstatuslistener',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\listeners\\__construct',
        1 => 'app\\domains\\leads\\listeners\\handle',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Listeners/SendLeadCreatedNotification.php' => 
    array (
      0 => 'bf412f903a80c987cc64aa00db774ee024d34d5e',
      1 => 
      array (
        0 => 'app\\domains\\leads\\listeners\\sendleadcreatednotification',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\listeners\\__construct',
        1 => 'app\\domains\\leads\\listeners\\handle',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Listeners/NotifyAgentOfNewChatListener.php' => 
    array (
      0 => '5d754c4f3a1cdcb63c4386058ef4526ef2f91861',
      1 => 
      array (
        0 => 'app\\domains\\leads\\listeners\\notifyagentofnewchatlistener',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\listeners\\__construct',
        1 => 'app\\domains\\leads\\listeners\\handle',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Listeners/SendLeadStatusUpdatedNotification.php' => 
    array (
      0 => '5d3cf0ef299f5dffd41472e5c4c732e264c7dfb4',
      1 => 
      array (
        0 => 'app\\domains\\leads\\listeners\\sendleadstatusupdatednotification',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\listeners\\__construct',
        1 => 'app\\domains\\leads\\listeners\\handle',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Listeners/ProcessIncomingMessageListener.php' => 
    array (
      0 => '8ae20dadd1e3f84e4ceb67258c54eacea5341c53',
      1 => 
      array (
        0 => 'app\\domains\\leads\\listeners\\processincomingmessagelistener',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\listeners\\__construct',
        1 => 'app\\domains\\leads\\listeners\\handle',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Notifications/NurturingNotification.php' => 
    array (
      0 => 'c4042a6544f948511a95c0ffe5fb346b640bff08',
      1 => 
      array (
        0 => 'app\\domains\\leads\\notifications\\nurturingnotification',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\notifications\\__construct',
        1 => 'app\\domains\\leads\\notifications\\via',
        2 => 'app\\domains\\leads\\notifications\\tomail',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Notifications/NewLeadNotification.php' => 
    array (
      0 => 'adef6e876bb9202f77c4568f347c6a90c818b9e3',
      1 => 
      array (
        0 => 'app\\domains\\leads\\notifications\\newleadnotification',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\notifications\\__construct',
        1 => 'app\\domains\\leads\\notifications\\via',
        2 => 'app\\domains\\leads\\notifications\\tomail',
        3 => 'app\\domains\\leads\\notifications\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Notifications/NewQualifiedLead.php' => 
    array (
      0 => '48cdb77498cc24d8c1f3bdbd5c9efcafd360f80f',
      1 => 
      array (
        0 => 'app\\domains\\leads\\notifications\\newqualifiedlead',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\notifications\\__construct',
        1 => 'app\\domains\\leads\\notifications\\via',
        2 => 'app\\domains\\leads\\notifications\\tomail',
        3 => 'app\\domains\\leads\\notifications\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Services/LeadStatusService.php' => 
    array (
      0 => '804d15cd05faf7fb7a986d2fbb5b82ef11227c0e',
      1 => 
      array (
        0 => 'app\\domains\\leads\\services\\leadstatusservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\services\\__construct',
        1 => 'app\\domains\\leads\\services\\updateleadstatus',
        2 => 'app\\domains\\leads\\services\\qualifylead',
        3 => 'app\\domains\\leads\\services\\disqualifylead',
        4 => 'app\\domains\\leads\\services\\convertlead',
        5 => 'app\\domains\\leads\\services\\loselead',
        6 => 'app\\domains\\leads\\services\\contactlead',
        7 => 'app\\domains\\leads\\services\\negotiatelead',
        8 => 'app\\domains\\leads\\services\\followuplead',
        9 => 'app\\domains\\leads\\services\\canchangestatus',
        10 => 'app\\domains\\leads\\services\\getstatushistory',
        11 => 'app\\domains\\leads\\services\\getstatusstatistics',
        12 => 'app\\domains\\leads\\services\\getleadsbystatus',
        13 => 'app\\domains\\leads\\services\\getleadscountbystatus',
        14 => 'app\\domains\\leads\\services\\getconversionratebystatus',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Services/SegmentSynchronizationService.php' => 
    array (
      0 => 'e058b0bee813e27aad72401a561acb48dba73ea6',
      1 => 
      array (
        0 => 'app\\domains\\leads\\services\\segmentsynchronizationservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\services\\__construct',
        1 => 'app\\domains\\leads\\services\\synchronizeallleadsegments',
        2 => 'app\\domains\\leads\\services\\synchronizeleadsegments',
        3 => 'app\\domains\\leads\\services\\synchronizesegmentleads',
        4 => 'app\\domains\\leads\\services\\addleadtosegment',
        5 => 'app\\domains\\leads\\services\\removeleadfromsegment',
        6 => 'app\\domains\\leads\\services\\getmatchingsegmentids',
        7 => 'app\\domains\\leads\\services\\getsynchronizationstatistics',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Services/LeadCustomFieldService.php' => 
    array (
      0 => '9eeb280c64e8ef57ba7146195af9a241abdd2f57',
      1 => 
      array (
        0 => 'app\\domains\\leads\\services\\leadcustomfieldservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\services\\__construct',
        1 => 'app\\domains\\leads\\services\\create',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Services/LeadService.php' => 
    array (
      0 => 'eb7f38af55747afde03e813fda12c851ad5517dc',
      1 => 
      array (
        0 => 'app\\domains\\leads\\services\\leadservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\services\\__construct',
        1 => 'app\\domains\\leads\\services\\createlead',
        2 => 'app\\domains\\leads\\services\\getleadbyid',
        3 => 'app\\domains\\leads\\services\\getleadbyemail',
        4 => 'app\\domains\\leads\\services\\updatelead',
        5 => 'app\\domains\\leads\\services\\deletelead',
        6 => 'app\\domains\\leads\\services\\listleads',
        7 => 'app\\domains\\leads\\services\\searchleads',
        8 => 'app\\domains\\leads\\services\\getleadsbystatus',
        9 => 'app\\domains\\leads\\services\\getleadsbysegment',
        10 => 'app\\domains\\leads\\services\\getleadsbyscore',
        11 => 'app\\domains\\leads\\services\\getleadscountbystatus',
        12 => 'app\\domains\\leads\\services\\getleadscountbysegment',
        13 => 'app\\domains\\leads\\services\\getleadsstatistics',
        14 => 'app\\domains\\leads\\services\\leadexists',
        15 => 'app\\domains\\leads\\services\\leadexistsbyemail',
        16 => 'app\\domains\\leads\\services\\updateleadstatus',
        17 => 'app\\domains\\leads\\services\\qualifylead',
        18 => 'app\\domains\\leads\\services\\disqualifylead',
        19 => 'app\\domains\\leads\\services\\convertlead',
        20 => 'app\\domains\\leads\\services\\loselead',
        21 => 'app\\domains\\leads\\services\\contactlead',
        22 => 'app\\domains\\leads\\services\\negotiatelead',
        23 => 'app\\domains\\leads\\services\\followuplead',
        24 => 'app\\domains\\leads\\services\\canchangestatus',
        25 => 'app\\domains\\leads\\services\\getstatushistory',
        26 => 'app\\domains\\leads\\services\\getstatusstatistics',
        27 => 'app\\domains\\leads\\services\\getconversionratebystatus',
        28 => 'app\\domains\\leads\\services\\getallleads',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Services/LeadScoreCalculationService.php' => 
    array (
      0 => '5da9f1469a137b4d6a2261de30556c502ce02b58',
      1 => 
      array (
        0 => 'app\\domains\\leads\\services\\leadscorecalculationservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\services\\calculateleadscore',
        1 => 'app\\domains\\leads\\services\\calculatestatusscore',
        2 => 'app\\domains\\leads\\services\\calculateemaildomainscore',
        3 => 'app\\domains\\leads\\services\\calculatecompanyscore',
        4 => 'app\\domains\\leads\\services\\calculatephonescore',
        5 => 'app\\domains\\leads\\services\\calculateactivityscore',
        6 => 'app\\domains\\leads\\services\\calculatesourcescore',
        7 => 'app\\domains\\leads\\services\\calculateresponsetimescore',
        8 => 'app\\domains\\leads\\services\\calculatetagsscore',
        9 => 'app\\domains\\leads\\services\\calculateinactivitypenalty',
        10 => 'app\\domains\\leads\\services\\calculatemultipleleadscores',
        11 => 'app\\domains\\leads\\services\\getscorestatistics',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Services/SegmentManagementService.php' => 
    array (
      0 => '3816d81770d09d6f66047d15a087030ab6b57495',
      1 => 
      array (
        0 => 'app\\domains\\leads\\services\\segmentmanagementservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\services\\__construct',
        1 => 'app\\domains\\leads\\services\\createsegment',
        2 => 'app\\domains\\leads\\services\\getsegmentbyid',
        3 => 'app\\domains\\leads\\services\\updatesegment',
        4 => 'app\\domains\\leads\\services\\deletesegment',
        5 => 'app\\domains\\leads\\services\\getallsegments',
        6 => 'app\\domains\\leads\\services\\searchsegmentsbyname',
        7 => 'app\\domains\\leads\\services\\getsegmentstatistics',
        8 => 'app\\domains\\leads\\services\\segmentexists',
        9 => 'app\\domains\\leads\\services\\getrecentsegments',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Services/IntegrationService.php' => 
    array (
      0 => '141196581276e278b41f1e91597f39ff599900df',
      1 => 
      array (
        0 => 'app\\domains\\leads\\services\\integrationservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\services\\__construct',
        1 => 'app\\domains\\leads\\services\\syncleadtocrm',
        2 => 'app\\domains\\leads\\services\\importleadsfromsource',
        3 => 'app\\domains\\leads\\services\\syncmultipleleadstocrm',
        4 => 'app\\domains\\leads\\services\\getintegrationstats',
        5 => 'app\\domains\\leads\\services\\getimportstats',
        6 => 'app\\domains\\leads\\services\\getsupportedcrms',
        7 => 'app\\domains\\leads\\services\\getsupportedsources',
        8 => 'app\\domains\\leads\\services\\iscrmsupported',
        9 => 'app\\domains\\leads\\services\\issourcesupported',
        10 => 'app\\domains\\leads\\services\\getintegrationhistory',
        11 => 'app\\domains\\leads\\services\\getimporthistory',
        12 => 'app\\domains\\leads\\services\\clearintegrationhistory',
        13 => 'app\\domains\\leads\\services\\getintegrationsummary',
        14 => 'app\\domains\\leads\\services\\testcrmconnection',
        15 => 'app\\domains\\leads\\services\\testsalesforceconnection',
        16 => 'app\\domains\\leads\\services\\testhubspotconnection',
        17 => 'app\\domains\\leads\\services\\testpipedriveconnection',
        18 => 'app\\domains\\leads\\services\\testzohoconnection',
        19 => 'app\\domains\\leads\\services\\testmondayconnection',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Services/LeadScoreDecayService.php' => 
    array (
      0 => '483f9e616f42a13ffe4a3ae8cc466c0bbb937a72',
      1 => 
      array (
        0 => 'app\\domains\\leads\\services\\leadscoredecayservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\services\\__construct',
        1 => 'app\\domains\\leads\\services\\decayleadscores',
        2 => 'app\\domains\\leads\\services\\decayleadscore',
        3 => 'app\\domains\\leads\\services\\decayleadsinactivefordays',
        4 => 'app\\domains\\leads\\services\\shoulddecayleadscore',
        5 => 'app\\domains\\leads\\services\\calculatedecayamount',
        6 => 'app\\domains\\leads\\services\\isleadinactivefordays',
        7 => 'app\\domains\\leads\\services\\getdecaystatistics',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Services/SegmentationService.php' => 
    array (
      0 => '2aa8debbd15333675851aaa11c5a0a3a8e44434e',
      1 => 
      array (
        0 => 'app\\domains\\leads\\services\\segmentationservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\services\\__construct',
        1 => 'app\\domains\\leads\\services\\createsegment',
        2 => 'app\\domains\\leads\\services\\getsegmentbyid',
        3 => 'app\\domains\\leads\\services\\updatesegment',
        4 => 'app\\domains\\leads\\services\\deletesegment',
        5 => 'app\\domains\\leads\\services\\getallsegments',
        6 => 'app\\domains\\leads\\services\\evaluatesegmentrules',
        7 => 'app\\domains\\leads\\services\\synchronizeallleadsegments',
        8 => 'app\\domains\\leads\\services\\addleadtosegment',
        9 => 'app\\domains\\leads\\services\\removeleadfromsegment',
        10 => 'app\\domains\\leads\\services\\searchsegmentsbyname',
        11 => 'app\\domains\\leads\\services\\getsegmentstatistics',
        12 => 'app\\domains\\leads\\services\\segmentexists',
        13 => 'app\\domains\\leads\\services\\getrecentsegments',
        14 => 'app\\domains\\leads\\services\\synchronizeleadsegments',
        15 => 'app\\domains\\leads\\services\\synchronizesegmentleads',
        16 => 'app\\domains\\leads\\services\\getsynchronizationstatistics',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Services/ScoringService.php' => 
    array (
      0 => '860ab508742549d8edc274c6b562cbdba78c35c8',
      1 => 
      array (
        0 => 'app\\domains\\leads\\services\\scoringservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\services\\__construct',
        1 => 'app\\domains\\leads\\services\\calculateleadscore',
        2 => 'app\\domains\\leads\\services\\updateleadscore',
        3 => 'app\\domains\\leads\\services\\decayleadscores',
        4 => 'app\\domains\\leads\\services\\setleadscore',
        5 => 'app\\domains\\leads\\services\\decayleadscore',
        6 => 'app\\domains\\leads\\services\\getdecaystatistics',
        7 => 'app\\domains\\leads\\services\\calculatemultipleleadscores',
        8 => 'app\\domains\\leads\\services\\getscorestatisticsforleads',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Services/DataSourceIntegrationService.php' => 
    array (
      0 => '54b4181a2b2ad09cf420e20de4eae66aa2fb6311',
      1 => 
      array (
        0 => 'app\\domains\\leads\\services\\datasourceintegrationservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\services\\importleadsfromsource',
        1 => 'app\\domains\\leads\\services\\importfromcsv',
        2 => 'app\\domains\\leads\\services\\importfromapiprovider',
        3 => 'app\\domains\\leads\\services\\importfromgooglesheets',
        4 => 'app\\domains\\leads\\services\\importfromairtable',
        5 => 'app\\domains\\leads\\services\\importfromwebhook',
        6 => 'app\\domains\\leads\\services\\parsecsvfile',
        7 => 'app\\domains\\leads\\services\\convertcsvdatatoleads',
        8 => 'app\\domains\\leads\\services\\convertapidatatoleads',
        9 => 'app\\domains\\leads\\services\\convertsheetsdatatoleads',
        10 => 'app\\domains\\leads\\services\\convertairtabledatatoleads',
        11 => 'app\\domains\\leads\\services\\convertwebhookdatatoleads',
        12 => 'app\\domains\\leads\\services\\getnestedvalue',
        13 => 'app\\domains\\leads\\services\\getsupportedsources',
        14 => 'app\\domains\\leads\\services\\issourcesupported',
        15 => 'app\\domains\\leads\\services\\getimportstats',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Services/LeadScoreManagementService.php' => 
    array (
      0 => 'eef6da44e5886cbb046509a583cc522aee5bf907',
      1 => 
      array (
        0 => 'app\\domains\\leads\\services\\leadscoremanagementservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\services\\__construct',
        1 => 'app\\domains\\leads\\services\\updateleadscore',
        2 => 'app\\domains\\leads\\services\\setleadscore',
        3 => 'app\\domains\\leads\\services\\updatemultipleleadscores',
        4 => 'app\\domains\\leads\\services\\getleadsbyscorerange',
        5 => 'app\\domains\\leads\\services\\gethighvalueleads',
        6 => 'app\\domains\\leads\\services\\getmediumvalueleads',
        7 => 'app\\domains\\leads\\services\\getlowvalueleads',
        8 => 'app\\domains\\leads\\services\\getscorestatistics',
        9 => 'app\\domains\\leads\\services\\getleadscorehistory',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Services/AnalyticsService.php' => 
    array (
      0 => 'd609098ef7d8638c3081d291e96c0c4c7d8aa1b6',
      1 => 
      array (
        0 => 'app\\domains\\leads\\services\\analyticsservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\services\\__construct',
        1 => 'app\\domains\\leads\\services\\gettotalleadsbystatus',
        2 => 'app\\domains\\leads\\services\\getconversionrate',
        3 => 'app\\domains\\leads\\services\\getrecentleadactivities',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Services/WorkflowService.php' => 
    array (
      0 => '6bf970adf6535dc5f3d3260edec04cf0479efeb4',
      1 => 
      array (
        0 => 'app\\domains\\leads\\services\\workflowservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\services\\startworkflowforlead',
        1 => 'app\\domains\\leads\\services\\evaluateworkflowsforlead',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Services/LeadManagementService.php' => 
    array (
      0 => 'c5579402f443792f4bed7cad87edc0b8c8bf0bf3',
      1 => 
      array (
        0 => 'app\\domains\\leads\\services\\leadmanagementservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\services\\__construct',
        1 => 'app\\domains\\leads\\services\\createlead',
        2 => 'app\\domains\\leads\\services\\getleadbyid',
        3 => 'app\\domains\\leads\\services\\getleadbyemail',
        4 => 'app\\domains\\leads\\services\\updatelead',
        5 => 'app\\domains\\leads\\services\\deletelead',
        6 => 'app\\domains\\leads\\services\\listleads',
        7 => 'app\\domains\\leads\\services\\searchleads',
        8 => 'app\\domains\\leads\\services\\getleadsbystatus',
        9 => 'app\\domains\\leads\\services\\getleadsbysegment',
        10 => 'app\\domains\\leads\\services\\getleadsbyscore',
        11 => 'app\\domains\\leads\\services\\getleadscountbystatus',
        12 => 'app\\domains\\leads\\services\\getleadscountbysegment',
        13 => 'app\\domains\\leads\\services\\getleadsstatistics',
        14 => 'app\\domains\\leads\\services\\leadexists',
        15 => 'app\\domains\\leads\\services\\leadexistsbyemail',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Services/LeadScoreUpdateService.php' => 
    array (
      0 => '46164e9505393d3c7ac7f1797fa965b380f0ec2b',
      1 => 
      array (
        0 => 'app\\domains\\leads\\services\\leadscoreupdateservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\services\\__construct',
        1 => 'app\\domains\\leads\\services\\updateleadscore',
        2 => 'app\\domains\\leads\\services\\setleadscore',
        3 => 'app\\domains\\leads\\services\\updatemultipleleadscores',
        4 => 'app\\domains\\leads\\services\\applyscoremultiplier',
        5 => 'app\\domains\\leads\\services\\recalculateleadscore',
        6 => 'app\\domains\\leads\\services\\getscorehistory',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Services/LeadHistoryService.php' => 
    array (
      0 => '4fb0454a1d62a15240ed4c938543eb1a8785ca6d',
      1 => 
      array (
        0 => 'app\\domains\\leads\\services\\leadhistoryservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\services\\__construct',
        1 => 'app\\domains\\leads\\services\\recordactivity',
        2 => 'app\\domains\\leads\\services\\getleadhistory',
        3 => 'app\\domains\\leads\\services\\gethistoryentrybyid',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Services/NurturingRuleService.php' => 
    array (
      0 => 'ff18357e24909a169d1a85c98af91af94ea14b24',
      1 => 
      array (
        0 => 'app\\domains\\leads\\services\\nurturingruleservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\services\\evaluatenurturingrules',
        1 => 'app\\domains\\leads\\services\\addnurturingrule',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Services/CRMIntegrationService.php' => 
    array (
      0 => '8149593b435766686e9c51f24a5d15122198cc5d',
      1 => 
      array (
        0 => 'app\\domains\\leads\\services\\crmintegrationservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\services\\syncleadtocrm',
        1 => 'app\\domains\\leads\\services\\synctosalesforce',
        2 => 'app\\domains\\leads\\services\\synctohubspot',
        3 => 'app\\domains\\leads\\services\\synctopipedrive',
        4 => 'app\\domains\\leads\\services\\synctozoho',
        5 => 'app\\domains\\leads\\services\\synctomonday',
        6 => 'app\\domains\\leads\\services\\mapleadtosalesforce',
        7 => 'app\\domains\\leads\\services\\mapleadtohubspot',
        8 => 'app\\domains\\leads\\services\\mapleadtopipedrive',
        9 => 'app\\domains\\leads\\services\\mapleadtozoho',
        10 => 'app\\domains\\leads\\services\\mapleadtomonday',
        11 => 'app\\domains\\leads\\services\\mapstatustosalesforce',
        12 => 'app\\domains\\leads\\services\\mapstatustohubspot',
        13 => 'app\\domains\\leads\\services\\mapstatustopipedrive',
        14 => 'app\\domains\\leads\\services\\mapstatustozoho',
        15 => 'app\\domains\\leads\\services\\mapstatustomonday',
        16 => 'app\\domains\\leads\\services\\getcrmcredentials',
        17 => 'app\\domains\\leads\\services\\recordintegration',
        18 => 'app\\domains\\leads\\services\\getsupportedcrms',
        19 => 'app\\domains\\leads\\services\\iscrmsupported',
        20 => 'app\\domains\\leads\\services\\getintegrationstats',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Leads/Services/SegmentRuleEvaluationService.php' => 
    array (
      0 => 'd4de0a979a2cee6dd33327cd2c7253759d36cdd0',
      1 => 
      array (
        0 => 'app\\domains\\leads\\services\\segmentruleevaluationservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\leads\\services\\__construct',
        1 => 'app\\domains\\leads\\services\\evaluatesegmentrules',
        2 => 'app\\domains\\leads\\services\\leadmatchessegmentrules',
        3 => 'app\\domains\\leads\\services\\evaluaterule',
        4 => 'app\\domains\\leads\\services\\evaluaterulevalue',
        5 => 'app\\domains\\leads\\services\\comparedates',
        6 => 'app\\domains\\leads\\services\\comparedaterange',
        7 => 'app\\domains\\leads\\services\\getleadsmatchingmultiplesegments',
      ),
      3 => 
      array (
      ),
    ),
  ),
));