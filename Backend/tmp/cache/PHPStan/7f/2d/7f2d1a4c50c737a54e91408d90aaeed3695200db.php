<?php declare(strict_types = 1);

// odsl-/root/projetos/xWin_Dash/Backend/app/Domains/Media
return \PHPStan\Cache\CacheItem::__set_state(array(
   'variableKey' => 'v1',
   'data' => 
  array (
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Contracts/MediaRepositoryInterface.php' => 
    array (
      0 => '8aab1d0a69e64c4c8188855793ba4ad0adc40854',
      1 => 
      array (
        0 => 'app\\domains\\media\\contracts\\mediarepositoryinterface',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\contracts\\find',
        1 => 'app\\domains\\media\\contracts\\all',
        2 => 'app\\domains\\media\\contracts\\paginate',
        3 => 'app\\domains\\media\\contracts\\create',
        4 => 'app\\domains\\media\\contracts\\update',
        5 => 'app\\domains\\media\\contracts\\delete',
        6 => 'app\\domains\\media\\contracts\\findbyfolder',
        7 => 'app\\domains\\media\\contracts\\findbytype',
        8 => 'app\\domains\\media\\contracts\\findbyproject',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Providers/MediaDomainServiceProvider.php' => 
    array (
      0 => '6b738c60fd2bb3e820ec6c5dee02f94fd1f4a179',
      1 => 
      array (
        0 => 'app\\domains\\media\\providers\\mediadomainserviceprovider',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\providers\\register',
        1 => 'app\\domains\\media\\providers\\boot',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Providers/EventServiceProvider.php' => 
    array (
      0 => '25ca72c9fe79b5e7f46fe29da40b7486f324abd7',
      1 => 
      array (
        0 => 'app\\domains\\media\\providers\\eventserviceprovider',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\providers\\boot',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Resources/FolderResource.php' => 
    array (
      0 => '5579a9267127e4e69842b0bfc52b15f98809024e',
      1 => 
      array (
        0 => 'app\\domains\\media\\resources\\folderresource',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\resources\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Resources/MediaResource.php' => 
    array (
      0 => '42970edfce941fe75422260a409c3eb8e9601b44',
      1 => 
      array (
        0 => 'app\\domains\\media\\resources\\mediaresource',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\resources\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Workflows/MediaProcessingWorkflow.php' => 
    array (
      0 => '333921b3b42ef48e2d3787f0b5474efa0491bd07',
      1 => 
      array (
        0 => 'app\\domains\\media\\workflows\\mediaprocessingworkflow',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\workflows\\definition',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Models/MediaFile.php' => 
    array (
      0 => 'c8763b38348c24e2dc01b77c22ddb723c23c8afb',
      1 => 
      array (
        0 => 'app\\domains\\media\\models\\mediafile',
      ),
      2 => 
      array (
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Models/MediaFolder.php' => 
    array (
      0 => '267b73eb858a48314a99d58ad7676613a477746e',
      1 => 
      array (
        0 => 'app\\domains\\media\\models\\mediafolder',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\models\\parent',
        1 => 'app\\domains\\media\\models\\children',
        2 => 'app\\domains\\media\\models\\files',
        3 => 'app\\domains\\media\\models\\creator',
        4 => 'app\\domains\\media\\models\\scoperoot',
        5 => 'app\\domains\\media\\models\\scopepublic',
        6 => 'app\\domains\\media\\models\\getfullpath',
        7 => 'app\\domains\\media\\models\\isroot',
        8 => 'app\\domains\\media\\models\\gettotalfilescount',
        9 => 'app\\domains\\media\\models\\getalldescendants',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Models/Media.php' => 
    array (
      0 => '7c1fc1b0236c2e136df4a9c8102542e2243fccd9',
      1 => 
      array (
        0 => 'app\\domains\\media\\models\\media',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\models\\boot',
        1 => 'app\\domains\\media\\models\\newfactory',
        2 => 'app\\domains\\media\\models\\folder',
        3 => 'app\\domains\\media\\models\\user',
        4 => 'app\\domains\\media\\models\\project',
        5 => 'app\\domains\\media\\models\\isimage',
        6 => 'app\\domains\\media\\models\\isvideo',
        7 => 'app\\domains\\media\\models\\isdocument',
        8 => 'app\\domains\\media\\models\\getformattedsizeattribute',
        9 => 'app\\domains\\media\\models\\geturlattribute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Policies/MediaPolicy.php' => 
    array (
      0 => '8da3171bbb71bc334c1aebd3e862f7061dcc5c31',
      1 => 
      array (
        0 => 'app\\domains\\media\\policies\\mediapolicy',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\policies\\before',
        1 => 'app\\domains\\media\\policies\\viewany',
        2 => 'app\\domains\\media\\policies\\view',
        3 => 'app\\domains\\media\\policies\\create',
        4 => 'app\\domains\\media\\policies\\update',
        5 => 'app\\domains\\media\\policies\\delete',
        6 => 'app\\domains\\media\\policies\\restore',
        7 => 'app\\domains\\media\\policies\\forcedelete',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Policies/FolderPolicy.php' => 
    array (
      0 => 'e6401d9e9e9d4b915c9e42ca9780013f0d5011ec',
      1 => 
      array (
        0 => 'app\\domains\\media\\policies\\folderpolicy',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\policies\\before',
        1 => 'app\\domains\\media\\policies\\viewany',
        2 => 'app\\domains\\media\\policies\\view',
        3 => 'app\\domains\\media\\policies\\create',
        4 => 'app\\domains\\media\\policies\\update',
        5 => 'app\\domains\\media\\policies\\delete',
        6 => 'app\\domains\\media\\policies\\restore',
        7 => 'app\\domains\\media\\policies\\forcedelete',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Sagas/DeleteFolderSaga.php' => 
    array (
      0 => '37eadda9812f93703259b215f140d381163bbaa3',
      1 => 
      array (
        0 => 'app\\domains\\media\\sagas\\deletefoldersaga',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\sagas\\__construct',
        1 => 'app\\domains\\media\\sagas\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Http/Resources/FolderResource.php' => 
    array (
      0 => '371de388d9a927296aa6d3c7012544bee284cd80',
      1 => 
      array (
        0 => 'app\\domains\\media\\http\\resources\\folderresource',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\http\\resources\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Http/Resources/MediaResource.php' => 
    array (
      0 => 'c0a8ec136d2a2dec16a4da01806d9fe6c84be384',
      1 => 
      array (
        0 => 'app\\domains\\media\\http\\resources\\mediaresource',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\http\\resources\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Http/Requests/UpdateFolderRequest.php' => 
    array (
      0 => 'b2a569084a4c1f9f93f9d47b26e98c9156a4060f',
      1 => 
      array (
        0 => 'app\\domains\\media\\http\\requests\\updatefolderrequest',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\http\\requests\\authorize',
        1 => 'app\\domains\\media\\http\\requests\\rules',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Http/Requests/UpdateMediaRequest.php' => 
    array (
      0 => 'ff4fc1a01ee3b8631169e6838aff3205a83ab760',
      1 => 
      array (
        0 => 'app\\domains\\media\\http\\requests\\updatemediarequest',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\http\\requests\\authorize',
        1 => 'app\\domains\\media\\http\\requests\\rules',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Http/Requests/StoreMediaRequest.php' => 
    array (
      0 => 'dcdaea9a36ac428fe73502054f296ed37e73d9e8',
      1 => 
      array (
        0 => 'app\\domains\\media\\http\\requests\\storemediarequest',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\http\\requests\\authorize',
        1 => 'app\\domains\\media\\http\\requests\\rules',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Http/Requests/StoreFolderRequest.php' => 
    array (
      0 => '673dfebdcd62861dc320996ba7977805db17e3ab',
      1 => 
      array (
        0 => 'app\\domains\\media\\http\\requests\\storefolderrequest',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\http\\requests\\authorize',
        1 => 'app\\domains\\media\\http\\requests\\rules',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Http/Controllers/MediaController.php' => 
    array (
      0 => '1d03fe8a050db5fd1ec5aabfe04ed8a879c7bb3e',
      1 => 
      array (
        0 => 'app\\domains\\media\\http\\controllers\\mediacontroller',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\http\\controllers\\__construct',
        1 => 'app\\domains\\media\\http\\controllers\\getprojectid',
        2 => 'app\\domains\\media\\http\\controllers\\index',
        3 => 'app\\domains\\media\\http\\controllers\\store',
        4 => 'app\\domains\\media\\http\\controllers\\show',
        5 => 'app\\domains\\media\\http\\controllers\\update',
        6 => 'app\\domains\\media\\http\\controllers\\destroy',
        7 => 'app\\domains\\media\\http\\controllers\\optimize',
        8 => 'app\\domains\\media\\http\\controllers\\bulkdelete',
        9 => 'app\\domains\\media\\http\\controllers\\generateaitags',
        10 => 'app\\domains\\media\\http\\controllers\\generateaidescription',
        11 => 'app\\domains\\media\\http\\controllers\\detectobjects',
        12 => 'app\\domains\\media\\http\\controllers\\recognizefaces',
        13 => 'app\\domains\\media\\http\\controllers\\extracttext',
        14 => 'app\\domains\\media\\http\\controllers\\categorizemedia',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Http/Controllers/FolderController.php' => 
    array (
      0 => '50c038f7e96724d0d0e7bb9aaa50f275fd47332c',
      1 => 
      array (
        0 => 'app\\domains\\media\\http\\controllers\\foldercontroller',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\http\\controllers\\__construct',
        1 => 'app\\domains\\media\\http\\controllers\\index',
        2 => 'app\\domains\\media\\http\\controllers\\store',
        3 => 'app\\domains\\media\\http\\controllers\\update',
        4 => 'app\\domains\\media\\http\\controllers\\destroy',
        5 => 'app\\domains\\media\\http\\controllers\\move',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Http/Controllers/LibraryController.php' => 
    array (
      0 => '33602c16e15939dec045c83070dd6b33056c4589',
      1 => 
      array (
        0 => 'app\\domains\\media\\http\\controllers\\librarycontroller',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\http\\controllers\\library',
        1 => 'app\\domains\\media\\http\\controllers\\getfiletype',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Activities/ValidateMediaActivity.php' => 
    array (
      0 => '93547b171078e5bee88fa0923decd50654cdbdd7',
      1 => 
      array (
        0 => 'app\\domains\\media\\activities\\validatemediaactivity',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\activities\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Activities/OptimizeMediaActivity.php' => 
    array (
      0 => 'e83db936f99ecb17bd124a00a4dd9d838be69ea2',
      1 => 
      array (
        0 => 'app\\domains\\media\\activities\\optimizemediaactivity',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\activities\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Activities/GenerateVariantsActivity.php' => 
    array (
      0 => '47b3baf7583e5cc9f1a273412083cf368770066b',
      1 => 
      array (
        0 => 'app\\domains\\media\\activities\\generatevariantsactivity',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\activities\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Activities/UploadToCDNActivity.php' => 
    array (
      0 => '8b5690ab216764af8315ee4a5fe1f2c3e00ee116',
      1 => 
      array (
        0 => 'app\\domains\\media\\activities\\uploadtocdnactivity',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\activities\\execute',
        1 => 'app\\domains\\media\\activities\\uploadfiletocdn',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Queries/GetMediaQuery.php' => 
    array (
      0 => '9bb43ef28069b488191d119cb955f07971cf3e3c',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\queries\\getmediaquery',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\queries\\__construct',
        1 => 'app\\domains\\media\\application\\queries\\fromarray',
        2 => 'app\\domains\\media\\application\\queries\\toarray',
        3 => 'app\\domains\\media\\application\\queries\\isvalid',
        4 => 'app\\domains\\media\\application\\queries\\getvalidationerrors',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Queries/ListMediaQuery.php' => 
    array (
      0 => 'f87d44a2bde50c24906b46e3bca2f77a9861db8f',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\queries\\listmediaquery',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\queries\\__construct',
        1 => 'app\\domains\\media\\application\\queries\\fromarray',
        2 => 'app\\domains\\media\\application\\queries\\toarray',
        3 => 'app\\domains\\media\\application\\queries\\isvalid',
        4 => 'app\\domains\\media\\application\\queries\\getvalidationerrors',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Queries/ListFoldersQuery.php' => 
    array (
      0 => '2bca619ba222259b87d7b370f9132594ed43812b',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\queries\\listfoldersquery',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\queries\\__construct',
        1 => 'app\\domains\\media\\application\\queries\\fromarray',
        2 => 'app\\domains\\media\\application\\queries\\toarray',
        3 => 'app\\domains\\media\\application\\queries\\isvalid',
        4 => 'app\\domains\\media\\application\\queries\\getvalidationerrors',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Queries/GetFolderQuery.php' => 
    array (
      0 => '08f0899912a222bb268c4053332adc80bc7f235a',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\queries\\getfolderquery',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\queries\\__construct',
        1 => 'app\\domains\\media\\application\\queries\\fromarray',
        2 => 'app\\domains\\media\\application\\queries\\toarray',
        3 => 'app\\domains\\media\\application\\queries\\isvalid',
        4 => 'app\\domains\\media\\application\\queries\\getvalidationerrors',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Commands/UpdateFolderCommand.php' => 
    array (
      0 => '1f8f4ca88e190de8eca8274bfda6ab7e60aa64ce',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\commands\\updatefoldercommand',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\commands\\__construct',
        1 => 'app\\domains\\media\\application\\commands\\fromarray',
        2 => 'app\\domains\\media\\application\\commands\\toarray',
        3 => 'app\\domains\\media\\application\\commands\\isvalid',
        4 => 'app\\domains\\media\\application\\commands\\getvalidationerrors',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Commands/UpdateMediaCommand.php' => 
    array (
      0 => '5ebe0b38b825eadbdf1a053cbaa0d9dc345a6db4',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\commands\\updatemediacommand',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\commands\\__construct',
        1 => 'app\\domains\\media\\application\\commands\\fromarray',
        2 => 'app\\domains\\media\\application\\commands\\toarray',
        3 => 'app\\domains\\media\\application\\commands\\isvalid',
        4 => 'app\\domains\\media\\application\\commands\\getvalidationerrors',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Commands/DeleteMediaCommand.php' => 
    array (
      0 => 'cbe99d094d48ab82d2e5aa6e45c52e94d7335a6e',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\commands\\deletemediacommand',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\commands\\__construct',
        1 => 'app\\domains\\media\\application\\commands\\fromarray',
        2 => 'app\\domains\\media\\application\\commands\\toarray',
        3 => 'app\\domains\\media\\application\\commands\\isvalid',
        4 => 'app\\domains\\media\\application\\commands\\getvalidationerrors',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Commands/CreateFolderCommand.php' => 
    array (
      0 => 'ef0ff528516d150b87aec0cab9c279978d554034',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\commands\\createfoldercommand',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\commands\\__construct',
        1 => 'app\\domains\\media\\application\\commands\\fromarray',
        2 => 'app\\domains\\media\\application\\commands\\toarray',
        3 => 'app\\domains\\media\\application\\commands\\isvalid',
        4 => 'app\\domains\\media\\application\\commands\\getvalidationerrors',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Commands/DeleteFolderCommand.php' => 
    array (
      0 => 'b21594e46606fc8c6f58f6f847ef734aa9d16a1d',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\commands\\deletefoldercommand',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\commands\\__construct',
        1 => 'app\\domains\\media\\application\\commands\\fromarray',
        2 => 'app\\domains\\media\\application\\commands\\toarray',
        3 => 'app\\domains\\media\\application\\commands\\isvalid',
        4 => 'app\\domains\\media\\application\\commands\\getvalidationerrors',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Commands/UploadMediaCommand.php' => 
    array (
      0 => '338c1f916911141015c340f844ca8a4605dd333c',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\commands\\uploadmediacommand',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\commands\\__construct',
        1 => 'app\\domains\\media\\application\\commands\\fromarray',
        2 => 'app\\domains\\media\\application\\commands\\toarray',
        3 => 'app\\domains\\media\\application\\commands\\isvalid',
        4 => 'app\\domains\\media\\application\\commands\\getvalidationerrors',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Commands/OrganizeMediaCommand.php' => 
    array (
      0 => '8ad7cf49d48276d5ebb452e056732dbc43413afe',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\commands\\organizemediacommand',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\commands\\__construct',
        1 => 'app\\domains\\media\\application\\commands\\fromarray',
        2 => 'app\\domains\\media\\application\\commands\\toarray',
        3 => 'app\\domains\\media\\application\\commands\\isvalid',
        4 => 'app\\domains\\media\\application\\commands\\getvalidationerrors',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/UseCases/OrganizeMediaUseCase.php' => 
    array (
      0 => 'c29dc372e0b0cae6b460cef866043d14ef743a0d',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\usecases\\organizemediausecase',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\usecases\\__construct',
        1 => 'app\\domains\\media\\application\\usecases\\execute',
        2 => 'app\\domains\\media\\application\\usecases\\getstats',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/UseCases/UploadMediaUseCase.php' => 
    array (
      0 => '72ef327e424090e31dc8a6bd6e2cce9d71dd9eb1',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\usecases\\uploadmediausecase',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\usecases\\__construct',
        1 => 'app\\domains\\media\\application\\usecases\\execute',
        2 => 'app\\domains\\media\\application\\usecases\\getstats',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/UseCases/DeleteFolderUseCase.php' => 
    array (
      0 => '6401aa7e0a65ff44ad3fb170a9cd413e3555b20b',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\usecases\\deletefolderusecase',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\usecases\\__construct',
        1 => 'app\\domains\\media\\application\\usecases\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/UseCases/DeleteMediaUseCase.php' => 
    array (
      0 => '09c10a895b009d206eef841054a75cc8cba142ec',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\usecases\\deletemediausecase',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\usecases\\__construct',
        1 => 'app\\domains\\media\\application\\usecases\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/UseCases/CreateFolderUseCase.php' => 
    array (
      0 => 'b3175bac25012d5a88af7d1485b03705af85f9aa',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\usecases\\createfolderusecase',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\usecases\\__construct',
        1 => 'app\\domains\\media\\application\\usecases\\execute',
        2 => 'app\\domains\\media\\application\\usecases\\validatecommand',
        3 => 'app\\domains\\media\\application\\usecases\\createfolderentity',
        4 => 'app\\domains\\media\\application\\usecases\\validatecrossmodulerules',
        5 => 'app\\domains\\media\\application\\usecases\\validateuserlimits',
        6 => 'app\\domains\\media\\application\\usecases\\validateparentfolder',
        7 => 'app\\domains\\media\\application\\usecases\\wouldcreateloop',
        8 => 'app\\domains\\media\\application\\usecases\\validateuniqueslug',
        9 => 'app\\domains\\media\\application\\usecases\\executepostcreationactions',
        10 => 'app\\domains\\media\\application\\usecases\\dispatchdomainevent',
        11 => 'app\\domains\\media\\application\\usecases\\getstats',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/UseCases/UpdateFolderUseCase.php' => 
    array (
      0 => 'a75e5d4cf3a90a2d2c9578285941e6179943731b',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\usecases\\updatefolderusecase',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\usecases\\__construct',
        1 => 'app\\domains\\media\\application\\usecases\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/UseCases/UpdateMediaUseCase.php' => 
    array (
      0 => 'e562d73d1cd68ad598f3373ca4a72e2d65f57cce',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\usecases\\updatemediausecase',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\usecases\\__construct',
        1 => 'app\\domains\\media\\application\\usecases\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Services/FolderManagementService.php' => 
    array (
      0 => 'f35b6ac2250442b257c8f7c59520a8aba2434053',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\services\\foldermanagementservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\services\\__construct',
        1 => 'app\\domains\\media\\application\\services\\createfolder',
        2 => 'app\\domains\\media\\application\\services\\updatefolder',
        3 => 'app\\domains\\media\\application\\services\\deletefolder',
        4 => 'app\\domains\\media\\application\\services\\getfolder',
        5 => 'app\\domains\\media\\application\\services\\listfolders',
        6 => 'app\\domains\\media\\application\\services\\searchfolders',
        7 => 'app\\domains\\media\\application\\services\\getfoldersbyuser',
        8 => 'app\\domains\\media\\application\\services\\getrootfolders',
        9 => 'app\\domains\\media\\application\\services\\getsubfolders',
        10 => 'app\\domains\\media\\application\\services\\getfoldertree',
        11 => 'app\\domains\\media\\application\\services\\getfolderpath',
        12 => 'app\\domains\\media\\application\\services\\getfolderstatistics',
        13 => 'app\\domains\\media\\application\\services\\getfolderscountbyuser',
        14 => 'app\\domains\\media\\application\\services\\folderexists',
        15 => 'app\\domains\\media\\application\\services\\isfolderempty',
        16 => 'app\\domains\\media\\application\\services\\getemptyfolders',
        17 => 'app\\domains\\media\\application\\services\\getfolderswithmostmedia',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Services/MediaOrganizationValidationService.php' => 
    array (
      0 => 'c82dc9d76d2d159dd96f0b47ba8e8784bfc0c60a',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\services\\mediaorganizationvalidationservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\services\\__construct',
        1 => 'app\\domains\\media\\application\\services\\validatecommand',
        2 => 'app\\domains\\media\\application\\services\\validatecrossmodulerules',
        3 => 'app\\domains\\media\\application\\services\\validaterequiredfields',
        4 => 'app\\domains\\media\\application\\services\\validateoperation',
        5 => 'app\\domains\\media\\application\\services\\validatemediaids',
        6 => 'app\\domains\\media\\application\\services\\validatetargetfolder',
        7 => 'app\\domains\\media\\application\\services\\validatemedia',
        8 => 'app\\domains\\media\\application\\services\\validatetargetfolderownership',
        9 => 'app\\domains\\media\\application\\services\\validatespecificoperation',
        10 => 'app\\domains\\media\\application\\services\\validatemoveoperation',
        11 => 'app\\domains\\media\\application\\services\\validatecopyoperation',
        12 => 'app\\domains\\media\\application\\services\\validateremoveoperation',
        13 => 'app\\domains\\media\\application\\services\\validateuserlimits',
        14 => 'app\\domains\\media\\application\\services\\validateaccesspermissions',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Services/MediaApplicationService.php' => 
    array (
      0 => 'fa35d4949addd966c6b419cecdec792fdf007523',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\services\\mediaapplicationservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\services\\__construct',
        1 => 'app\\domains\\media\\application\\services\\uploadmedia',
        2 => 'app\\domains\\media\\application\\services\\updatemedia',
        3 => 'app\\domains\\media\\application\\services\\deletemedia',
        4 => 'app\\domains\\media\\application\\services\\getmedia',
        5 => 'app\\domains\\media\\application\\services\\listmedia',
        6 => 'app\\domains\\media\\application\\services\\searchmedia',
        7 => 'app\\domains\\media\\application\\services\\getmediabytype',
        8 => 'app\\domains\\media\\application\\services\\getmediabyfolder',
        9 => 'app\\domains\\media\\application\\services\\getmediabyuser',
        10 => 'app\\domains\\media\\application\\services\\getrecentmedia',
        11 => 'app\\domains\\media\\application\\services\\getmediabysize',
        12 => 'app\\domains\\media\\application\\services\\getmediastatistics',
        13 => 'app\\domains\\media\\application\\services\\getunusedmedia',
        14 => 'app\\domains\\media\\application\\services\\getduplicatemedia',
        15 => 'app\\domains\\media\\application\\services\\createfolder',
        16 => 'app\\domains\\media\\application\\services\\updatefolder',
        17 => 'app\\domains\\media\\application\\services\\deletefolder',
        18 => 'app\\domains\\media\\application\\services\\getfolder',
        19 => 'app\\domains\\media\\application\\services\\listfolders',
        20 => 'app\\domains\\media\\application\\services\\searchfolders',
        21 => 'app\\domains\\media\\application\\services\\getfoldersbyuser',
        22 => 'app\\domains\\media\\application\\services\\getrootfolders',
        23 => 'app\\domains\\media\\application\\services\\getsubfolders',
        24 => 'app\\domains\\media\\application\\services\\getfoldertree',
        25 => 'app\\domains\\media\\application\\services\\getfolderpath',
        26 => 'app\\domains\\media\\application\\services\\getfolderstatistics',
        27 => 'app\\domains\\media\\application\\services\\getemptyfolders',
        28 => 'app\\domains\\media\\application\\services\\getfolderswithmostmedia',
        29 => 'app\\domains\\media\\application\\services\\organizemedia',
        30 => 'app\\domains\\media\\application\\services\\getdashboard',
        31 => 'app\\domains\\media\\application\\services\\getsummarystatistics',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Services/MediaOrganizationOrchestratorService.php' => 
    array (
      0 => 'bc8eb01574dac2d95cfd8416f9fc899b61093fe0',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\services\\mediaorganizationorchestratorservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\services\\__construct',
        1 => 'app\\domains\\media\\application\\services\\orchestratemediaorganization',
        2 => 'app\\domains\\media\\application\\services\\executepostorganizationactions',
        3 => 'app\\domains\\media\\application\\services\\dispatchdomainevent',
        4 => 'app\\domains\\media\\application\\services\\getstats',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Services/MediaUploadValidationService.php' => 
    array (
      0 => '53b82a49ca13664a8f02da69a0e0eeb0e1f4827e',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\services\\mediauploadvalidationservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\services\\__construct',
        1 => 'app\\domains\\media\\application\\services\\validatecommand',
        2 => 'app\\domains\\media\\application\\services\\validatecrossmodulerules',
        3 => 'app\\domains\\media\\application\\services\\validaterequiredfields',
        4 => 'app\\domains\\media\\application\\services\\validatefilesize',
        5 => 'app\\domains\\media\\application\\services\\validatefiletype',
        6 => 'app\\domains\\media\\application\\services\\validatefilename',
        7 => 'app\\domains\\media\\application\\services\\validateuserlimits',
        8 => 'app\\domains\\media\\application\\services\\validatefolder',
        9 => 'app\\domains\\media\\application\\services\\determinemediatype',
        10 => 'app\\domains\\media\\application\\services\\validatefilesecurity',
        11 => 'app\\domains\\media\\application\\services\\validatefileuniqueness',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Services/MediaManagementService.php' => 
    array (
      0 => '6b43d442338f7425feed0951d048376c861fd523',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\services\\mediamanagementservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\services\\__construct',
        1 => 'app\\domains\\media\\application\\services\\uploadmedia',
        2 => 'app\\domains\\media\\application\\services\\updatemedia',
        3 => 'app\\domains\\media\\application\\services\\deletemedia',
        4 => 'app\\domains\\media\\application\\services\\getmedia',
        5 => 'app\\domains\\media\\application\\services\\listmedia',
        6 => 'app\\domains\\media\\application\\services\\searchmedia',
        7 => 'app\\domains\\media\\application\\services\\getmediabytype',
        8 => 'app\\domains\\media\\application\\services\\getmediabyfolder',
        9 => 'app\\domains\\media\\application\\services\\getmediabyuser',
        10 => 'app\\domains\\media\\application\\services\\getrecentmedia',
        11 => 'app\\domains\\media\\application\\services\\getmediabysize',
        12 => 'app\\domains\\media\\application\\services\\getmediastatistics',
        13 => 'app\\domains\\media\\application\\services\\getmediacountbytype',
        14 => 'app\\domains\\media\\application\\services\\getmediacountbyfolder',
        15 => 'app\\domains\\media\\application\\services\\mediaexists',
        16 => 'app\\domains\\media\\application\\services\\getunusedmedia',
        17 => 'app\\domains\\media\\application\\services\\getduplicatemedia',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Services/MediaUploadOrchestratorService.php' => 
    array (
      0 => '9f04fdf3aba80092076eaf908cea41f9121776ac',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\services\\mediauploadorchestratorservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\services\\__construct',
        1 => 'app\\domains\\media\\application\\services\\orchestratemediaupload',
        2 => 'app\\domains\\media\\application\\services\\createmediaentity',
        3 => 'app\\domains\\media\\application\\services\\executepostuploadactions',
        4 => 'app\\domains\\media\\application\\services\\dispatchdomainevent',
        5 => 'app\\domains\\media\\application\\services\\getstats',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Services/MediaOptimizationService.php' => 
    array (
      0 => 'd38056910468b3a1a356f82736e3cb1289578547',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\services\\mediaoptimizationservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\services\\optimize',
        1 => 'app\\domains\\media\\application\\services\\generatethumbnails',
        2 => 'app\\domains\\media\\application\\services\\applywatermark',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Services/MediaSearchService.php' => 
    array (
      0 => '4abd787cfd3b9bf1d6cbd81f093b2e44ba27f2df',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\services\\mediasearchservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\services\\search',
        1 => 'app\\domains\\media\\application\\services\\findsimilar',
        2 => 'app\\domains\\media\\application\\services\\getbytags',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Services/MediaAnalyticsService.php' => 
    array (
      0 => 'a8e16477d729a81bf08a2e59724a6a1448aac8a4',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\services\\mediaanalyticsservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\services\\getstoragestats',
        1 => 'app\\domains\\media\\application\\services\\getusagebytype',
        2 => 'app\\domains\\media\\application\\services\\gettopmedia',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/DTOs/MediaUploadDTO.php' => 
    array (
      0 => 'bbc099bac2537fed1e621de20a19a07591b4614d',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\dtos\\mediauploaddto',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\dtos\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/DTOs/MediaFilterDTO.php' => 
    array (
      0 => '26619e9089332f7be7006edcd46a2f07aa30197f',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\dtos\\mediafilterdto',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\dtos\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/DTOs/MediaOptimizationDTO.php' => 
    array (
      0 => '368dbc1f7e6d389fbf3aa2527d9e9521c10d70dd',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\dtos\\mediaoptimizationdto',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\dtos\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/DTOs/FolderStructureDTO.php' => 
    array (
      0 => '99b656cfec6dcfdc9091a7267b85c422f2b586b0',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\dtos\\folderstructuredto',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\dtos\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Actions/UploadMediaAction.php' => 
    array (
      0 => '8d6b8c0da9e92caaac0292775904d182018d69a8',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\actions\\uploadmediaaction',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\actions\\__construct',
        1 => 'app\\domains\\media\\application\\actions\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Actions/OrganizeMediaAction.php' => 
    array (
      0 => 'a1b30059e1176f58a77532c28e154f31caa6aa74',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\actions\\organizemediaaction',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\actions\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Actions/OptimizeMediaAction.php' => 
    array (
      0 => '0e9bf1bb1e211c11f8b499769345a45877942359',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\actions\\optimizemediaaction',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\actions\\__construct',
        1 => 'app\\domains\\media\\application\\actions\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Application/Actions/BulkDeleteMediaAction.php' => 
    array (
      0 => '8110ce55ae7881ecb61f886ff8dffc95815d655d',
      1 => 
      array (
        0 => 'app\\domains\\media\\application\\actions\\bulkdeletemediaaction',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\application\\actions\\execute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Jobs/OptimizeMediaJob.php' => 
    array (
      0 => '8d755748cd5fdd9c31d0255535c857bbeda9a9a1',
      1 => 
      array (
        0 => 'app\\domains\\media\\jobs\\optimizemediajob',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\jobs\\__construct',
        1 => 'app\\domains\\media\\jobs\\handle',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Events/MediaUpdated.php' => 
    array (
      0 => 'ba75718a68a84618dfe3a3ed20ca001323a89de5',
      1 => 
      array (
        0 => 'app\\domains\\media\\events\\mediaupdated',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Events/FolderUpdated.php' => 
    array (
      0 => 'ddfb375ffc88b552519542138d131994b9298872',
      1 => 
      array (
        0 => 'app\\domains\\media\\events\\folderupdated',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Events/MediaCreated.php' => 
    array (
      0 => '9d1406aa0b8c6197def683fc9c46f1053a2bae5d',
      1 => 
      array (
        0 => 'app\\domains\\media\\events\\mediacreated',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Events/FolderCreated.php' => 
    array (
      0 => '9d06c17bfecb9101791eaed14f3341c2052aa04b',
      1 => 
      array (
        0 => 'app\\domains\\media\\events\\foldercreated',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Events/MediaDeleted.php' => 
    array (
      0 => '57c05a666fdc9b9eaeb7240ab7a94f7cf7c24978',
      1 => 
      array (
        0 => 'app\\domains\\media\\events\\mediadeleted',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Events/FolderDeleted.php' => 
    array (
      0 => '989d58bb2c8cdf236a6651d5cc1693db9f59ee2d',
      1 => 
      array (
        0 => 'app\\domains\\media\\events\\folderdeleted',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\events\\__construct',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Infrastructure/Persistence/Eloquent/FolderRepository.php' => 
    array (
      0 => '6ed83c29daee041953db298687a682137d1c9d40',
      1 => 
      array (
        0 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\folderrepository',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\__construct',
        1 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\find',
        2 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\findbyprojectid',
        3 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\create',
        4 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\update',
        5 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\delete',
        6 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\todomain',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Infrastructure/Persistence/Eloquent/FolderModel.php' => 
    array (
      0 => '458a063c5a2e2a6ea2561150660bc9f937132cf8',
      1 => 
      array (
        0 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\foldermodel',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\parent',
        1 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\children',
        2 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\media',
        3 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\project',
        4 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\user',
        5 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\getfullpathattribute',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Infrastructure/Persistence/Eloquent/MediaRepository.php' => 
    array (
      0 => '662b0c30fef77d3b28504dee9d1d06e46fe8c38f',
      1 => 
      array (
        0 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\mediarepository',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\__construct',
        1 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\find',
        2 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\all',
        3 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\paginate',
        4 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\create',
        5 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\update',
        6 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\delete',
        7 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\findbyfolder',
        8 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\findbytype',
        9 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\findbyproject',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Infrastructure/Persistence/Eloquent/MediaModel.php' => 
    array (
      0 => '53d589064b96b39e4088bddc65ed45d9b4e48aca',
      1 => 
      array (
        0 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\mediamodel',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\registermediaconversions',
        1 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\newfactory',
        2 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\gettypeattribute',
        3 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\settypeattribute',
        4 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\mediable',
        5 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\folder',
        6 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\user',
        7 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\project',
        8 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\geturlattribute',
        9 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\getcdnurls',
        10 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\setcdnurls',
        11 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\getcdnurl',
        12 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\gethumanreadablesizeattribute',
        13 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\isimage',
        14 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\isvideo',
        15 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\isaudio',
        16 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\isdocument',
        17 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\addtag',
        18 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\removetag',
        19 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\hastag',
        20 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\getdimensions',
        21 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\getduration',
        22 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\exists',
        23 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\deletefile',
        24 => 'app\\domains\\media\\infrastructure\\persistence\\eloquent\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Domain/MediaRepositoryInterface.php' => 
    array (
      0 => '49a12c82d4077bdb19b363d16434776792f85137',
      1 => 
      array (
        0 => 'app\\domains\\media\\domain\\mediarepositoryinterface',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\domain\\find',
        1 => 'app\\domains\\media\\domain\\findbyprojectid',
        2 => 'app\\domains\\media\\domain\\create',
        3 => 'app\\domains\\media\\domain\\update',
        4 => 'app\\domains\\media\\domain\\delete',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Domain/Folder.php' => 
    array (
      0 => '33d14fc16d500fa2bc635072e2811154a185bada',
      1 => 
      array (
        0 => 'app\\domains\\media\\domain\\folder',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\domain\\__construct',
        1 => 'app\\domains\\media\\domain\\validatename',
        2 => 'app\\domains\\media\\domain\\validateuserid',
        3 => 'app\\domains\\media\\domain\\validatedescription',
        4 => 'app\\domains\\media\\domain\\validateslug',
        5 => 'app\\domains\\media\\domain\\validatetags',
        6 => 'app\\domains\\media\\domain\\validatemetadata',
        7 => 'app\\domains\\media\\domain\\validatelastaccessedat',
        8 => 'app\\domains\\media\\domain\\fromarray',
        9 => 'app\\domains\\media\\domain\\toarray',
        10 => 'app\\domains\\media\\domain\\archive',
        11 => 'app\\domains\\media\\domain\\restore',
        12 => 'app\\domains\\media\\domain\\markasdeleted',
        13 => 'app\\domains\\media\\domain\\updatename',
        14 => 'app\\domains\\media\\domain\\updatedescription',
        15 => 'app\\domains\\media\\domain\\updateslug',
        16 => 'app\\domains\\media\\domain\\addtag',
        17 => 'app\\domains\\media\\domain\\removetag',
        18 => 'app\\domains\\media\\domain\\updatemetadata',
        19 => 'app\\domains\\media\\domain\\updatemediacount',
        20 => 'app\\domains\\media\\domain\\updatesubfoldercount',
        21 => 'app\\domains\\media\\domain\\incrementmediacount',
        22 => 'app\\domains\\media\\domain\\decrementmediacount',
        23 => 'app\\domains\\media\\domain\\incrementsubfoldercount',
        24 => 'app\\domains\\media\\domain\\decrementsubfoldercount',
        25 => 'app\\domains\\media\\domain\\movetoparent',
        26 => 'app\\domains\\media\\domain\\markasaccessed',
        27 => 'app\\domains\\media\\domain\\isactive',
        28 => 'app\\domains\\media\\domain\\isarchived',
        29 => 'app\\domains\\media\\domain\\isdeleted',
        30 => 'app\\domains\\media\\domain\\isfolder',
        31 => 'app\\domains\\media\\domain\\iscollection',
        32 => 'app\\domains\\media\\domain\\isgallery',
        33 => 'app\\domains\\media\\domain\\isroot',
        34 => 'app\\domains\\media\\domain\\hasparent',
        35 => 'app\\domains\\media\\domain\\hastag',
        36 => 'app\\domains\\media\\domain\\hasmetadata',
        37 => 'app\\domains\\media\\domain\\getmetadata',
        38 => 'app\\domains\\media\\domain\\getmediacount',
        39 => 'app\\domains\\media\\domain\\getsubfoldercount',
        40 => 'app\\domains\\media\\domain\\gettotalitems',
        41 => 'app\\domains\\media\\domain\\isempty',
        42 => 'app\\domains\\media\\domain\\canbedeleted',
        43 => 'app\\domains\\media\\domain\\canbearchived',
        44 => 'app\\domains\\media\\domain\\canberestored',
        45 => 'app\\domains\\media\\domain\\createfolder',
        46 => 'app\\domains\\media\\domain\\createcollection',
        47 => 'app\\domains\\media\\domain\\creategallery',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Domain/FolderRepositoryInterface.php' => 
    array (
      0 => 'd91f68ef2e4d50832bcd3fa153e2da8d6defa080',
      1 => 
      array (
        0 => 'app\\domains\\media\\domain\\folderrepositoryinterface',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\domain\\find',
        1 => 'app\\domains\\media\\domain\\findbyprojectid',
        2 => 'app\\domains\\media\\domain\\create',
        3 => 'app\\domains\\media\\domain\\update',
        4 => 'app\\domains\\media\\domain\\delete',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Domain/Media.php' => 
    array (
      0 => 'ad3ac36e6e46f5e4a857374905fc1ec19b5cc9d7',
      1 => 
      array (
        0 => 'app\\domains\\media\\domain\\media',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\domain\\__construct',
        1 => 'app\\domains\\media\\domain\\validatename',
        2 => 'app\\domains\\media\\domain\\validatefilename',
        3 => 'app\\domains\\media\\domain\\validatemimetype',
        4 => 'app\\domains\\media\\domain\\validatepath',
        5 => 'app\\domains\\media\\domain\\validatesize',
        6 => 'app\\domains\\media\\domain\\validateuserid',
        7 => 'app\\domains\\media\\domain\\validatestatus',
        8 => 'app\\domains\\media\\domain\\validatetype',
        9 => 'app\\domains\\media\\domain\\validatevisibility',
        10 => 'app\\domains\\media\\domain\\validatedescription',
        11 => 'app\\domains\\media\\domain\\validatemetadata',
        12 => 'app\\domains\\media\\domain\\validatetags',
        13 => 'app\\domains\\media\\domain\\validatethumbnailpath',
        14 => 'app\\domains\\media\\domain\\validatedimensions',
        15 => 'app\\domains\\media\\domain\\validateduration',
        16 => 'app\\domains\\media\\domain\\validatehash',
        17 => 'app\\domains\\media\\domain\\validatedownloadcount',
        18 => 'app\\domains\\media\\domain\\validatelastaccessedat',
        19 => 'app\\domains\\media\\domain\\fromarray',
        20 => 'app\\domains\\media\\domain\\toarray',
        21 => 'app\\domains\\media\\domain\\markasprocessing',
        22 => 'app\\domains\\media\\domain\\markasready',
        23 => 'app\\domains\\media\\domain\\markasfailed',
        24 => 'app\\domains\\media\\domain\\markasdeleted',
        25 => 'app\\domains\\media\\domain\\updatename',
        26 => 'app\\domains\\media\\domain\\updatedescription',
        27 => 'app\\domains\\media\\domain\\updatevisibility',
        28 => 'app\\domains\\media\\domain\\addtag',
        29 => 'app\\domains\\media\\domain\\removetag',
        30 => 'app\\domains\\media\\domain\\updatemetadata',
        31 => 'app\\domains\\media\\domain\\updatethumbnailpath',
        32 => 'app\\domains\\media\\domain\\updatedimensions',
        33 => 'app\\domains\\media\\domain\\updateduration',
        34 => 'app\\domains\\media\\domain\\updatehash',
        35 => 'app\\domains\\media\\domain\\incrementdownloadcount',
        36 => 'app\\domains\\media\\domain\\movetofolder',
        37 => 'app\\domains\\media\\domain\\markasaccessed',
        38 => 'app\\domains\\media\\domain\\isuploading',
        39 => 'app\\domains\\media\\domain\\isprocessing',
        40 => 'app\\domains\\media\\domain\\isready',
        41 => 'app\\domains\\media\\domain\\isfailed',
        42 => 'app\\domains\\media\\domain\\isdeleted',
        43 => 'app\\domains\\media\\domain\\isimage',
        44 => 'app\\domains\\media\\domain\\isvideo',
        45 => 'app\\domains\\media\\domain\\isaudio',
        46 => 'app\\domains\\media\\domain\\isdocument',
        47 => 'app\\domains\\media\\domain\\isarchive',
        48 => 'app\\domains\\media\\domain\\ispublic',
        49 => 'app\\domains\\media\\domain\\isprivate',
        50 => 'app\\domains\\media\\domain\\isunlisted',
        51 => 'app\\domains\\media\\domain\\hastag',
        52 => 'app\\domains\\media\\domain\\hasthumbnail',
        53 => 'app\\domains\\media\\domain\\hasmetadata',
        54 => 'app\\domains\\media\\domain\\getmetadata',
        55 => 'app\\domains\\media\\domain\\getsizeinmb',
        56 => 'app\\domains\\media\\domain\\getsizeingb',
        57 => 'app\\domains\\media\\domain\\getformattedsize',
        58 => 'app\\domains\\media\\domain\\getaspectratio',
        59 => 'app\\domains\\media\\domain\\getdurationinseconds',
        60 => 'app\\domains\\media\\domain\\getdurationformatted',
        61 => 'app\\domains\\media\\domain\\getdownloadcount',
        62 => 'app\\domains\\media\\domain\\canbedownloaded',
        63 => 'app\\domains\\media\\domain\\canbeviewed',
        64 => 'app\\domains\\media\\domain\\canbeedited',
        65 => 'app\\domains\\media\\domain\\canbedeleted',
        66 => 'app\\domains\\media\\domain\\createimage',
        67 => 'app\\domains\\media\\domain\\createvideo',
        68 => 'app\\domains\\media\\domain\\createaudio',
        69 => 'app\\domains\\media\\domain\\createdocument',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Domain/ValueObjects/FolderType.php' => 
    array (
      0 => 'bb64d65c8855fb9aab072c66f978da1a75c9dfa4',
      1 => 
      array (
        0 => 'app\\domains\\media\\domain\\valueobjects\\foldertype',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\domain\\valueobjects\\__construct',
        1 => 'app\\domains\\media\\domain\\valueobjects\\folder',
        2 => 'app\\domains\\media\\domain\\valueobjects\\collection',
        3 => 'app\\domains\\media\\domain\\valueobjects\\gallery',
        4 => 'app\\domains\\media\\domain\\valueobjects\\getvalue',
        5 => 'app\\domains\\media\\domain\\valueobjects\\isfolder',
        6 => 'app\\domains\\media\\domain\\valueobjects\\iscollection',
        7 => 'app\\domains\\media\\domain\\valueobjects\\isgallery',
        8 => 'app\\domains\\media\\domain\\valueobjects\\supportsnesting',
        9 => 'app\\domains\\media\\domain\\valueobjects\\supportsmedia',
        10 => 'app\\domains\\media\\domain\\valueobjects\\supportssubfolders',
        11 => 'app\\domains\\media\\domain\\valueobjects\\supportspublicaccess',
        12 => 'app\\domains\\media\\domain\\valueobjects\\supportssharing',
        13 => 'app\\domains\\media\\domain\\valueobjects\\getmaxdepth',
        14 => 'app\\domains\\media\\domain\\valueobjects\\getmaxitems',
        15 => 'app\\domains\\media\\domain\\valueobjects\\getdisplayname',
        16 => 'app\\domains\\media\\domain\\valueobjects\\geticon',
        17 => 'app\\domains\\media\\domain\\valueobjects\\getcolor',
        18 => 'app\\domains\\media\\domain\\valueobjects\\getdescription',
        19 => 'app\\domains\\media\\domain\\valueobjects\\getfeatures',
        20 => 'app\\domains\\media\\domain\\valueobjects\\equals',
        21 => 'app\\domains\\media\\domain\\valueobjects\\__tostring',
        22 => 'app\\domains\\media\\domain\\valueobjects\\validate',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Domain/ValueObjects/FolderStatus.php' => 
    array (
      0 => '448889c2818ab94a49738c0406ba09acf11512d8',
      1 => 
      array (
        0 => 'app\\domains\\media\\domain\\valueobjects\\folderstatus',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\domain\\valueobjects\\__construct',
        1 => 'app\\domains\\media\\domain\\valueobjects\\active',
        2 => 'app\\domains\\media\\domain\\valueobjects\\archived',
        3 => 'app\\domains\\media\\domain\\valueobjects\\deleted',
        4 => 'app\\domains\\media\\domain\\valueobjects\\getvalue',
        5 => 'app\\domains\\media\\domain\\valueobjects\\isactive',
        6 => 'app\\domains\\media\\domain\\valueobjects\\isarchived',
        7 => 'app\\domains\\media\\domain\\valueobjects\\isdeleted',
        8 => 'app\\domains\\media\\domain\\valueobjects\\canbearchived',
        9 => 'app\\domains\\media\\domain\\valueobjects\\canberestored',
        10 => 'app\\domains\\media\\domain\\valueobjects\\canbedeleted',
        11 => 'app\\domains\\media\\domain\\valueobjects\\canbeaccessed',
        12 => 'app\\domains\\media\\domain\\valueobjects\\canbemodified',
        13 => 'app\\domains\\media\\domain\\valueobjects\\getdisplayname',
        14 => 'app\\domains\\media\\domain\\valueobjects\\getcolor',
        15 => 'app\\domains\\media\\domain\\valueobjects\\geticon',
        16 => 'app\\domains\\media\\domain\\valueobjects\\getdescription',
        17 => 'app\\domains\\media\\domain\\valueobjects\\equals',
        18 => 'app\\domains\\media\\domain\\valueobjects\\__tostring',
        19 => 'app\\domains\\media\\domain\\valueobjects\\validate',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Domain/ValueObjects/MediaVisibility.php' => 
    array (
      0 => '085515aeb25ce52145643fb6431409ec007bad4e',
      1 => 
      array (
        0 => 'app\\domains\\media\\domain\\valueobjects\\mediavisibility',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\domain\\valueobjects\\__construct',
        1 => 'app\\domains\\media\\domain\\valueobjects\\public',
        2 => 'app\\domains\\media\\domain\\valueobjects\\private',
        3 => 'app\\domains\\media\\domain\\valueobjects\\unlisted',
        4 => 'app\\domains\\media\\domain\\valueobjects\\getvalue',
        5 => 'app\\domains\\media\\domain\\valueobjects\\ispublic',
        6 => 'app\\domains\\media\\domain\\valueobjects\\isprivate',
        7 => 'app\\domains\\media\\domain\\valueobjects\\isunlisted',
        8 => 'app\\domains\\media\\domain\\valueobjects\\canbeaccessedbyanyone',
        9 => 'app\\domains\\media\\domain\\valueobjects\\canbeaccessedbyowner',
        10 => 'app\\domains\\media\\domain\\valueobjects\\canbeaccessedbydirectlink',
        11 => 'app\\domains\\media\\domain\\valueobjects\\canbeindexedbysearch',
        12 => 'app\\domains\\media\\domain\\valueobjects\\canbeshared',
        13 => 'app\\domains\\media\\domain\\valueobjects\\getdisplayname',
        14 => 'app\\domains\\media\\domain\\valueobjects\\geticon',
        15 => 'app\\domains\\media\\domain\\valueobjects\\getcolor',
        16 => 'app\\domains\\media\\domain\\valueobjects\\getdescription',
        17 => 'app\\domains\\media\\domain\\valueobjects\\getsecuritylevel',
        18 => 'app\\domains\\media\\domain\\valueobjects\\ismoresecurethan',
        19 => 'app\\domains\\media\\domain\\valueobjects\\islesssecurethan',
        20 => 'app\\domains\\media\\domain\\valueobjects\\equals',
        21 => 'app\\domains\\media\\domain\\valueobjects\\__tostring',
        22 => 'app\\domains\\media\\domain\\valueobjects\\validate',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Domain/ValueObjects/FolderMetrics.php' => 
    array (
      0 => 'd5024be7a50d720840b4da54793ab3515b37cc7b',
      1 => 
      array (
        0 => 'app\\domains\\media\\domain\\valueobjects\\foldermetrics',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\domain\\valueobjects\\__construct',
        1 => 'app\\domains\\media\\domain\\valueobjects\\empty',
        2 => 'app\\domains\\media\\domain\\valueobjects\\getmediacount',
        3 => 'app\\domains\\media\\domain\\valueobjects\\getsubfoldercount',
        4 => 'app\\domains\\media\\domain\\valueobjects\\gettotalsize',
        5 => 'app\\domains\\media\\domain\\valueobjects\\getaccesscount',
        6 => 'app\\domains\\media\\domain\\valueobjects\\getlastaccessedat',
        7 => 'app\\domains\\media\\domain\\valueobjects\\incrementmediacount',
        8 => 'app\\domains\\media\\domain\\valueobjects\\decrementmediacount',
        9 => 'app\\domains\\media\\domain\\valueobjects\\incrementsubfoldercount',
        10 => 'app\\domains\\media\\domain\\valueobjects\\decrementsubfoldercount',
        11 => 'app\\domains\\media\\domain\\valueobjects\\addtototalsize',
        12 => 'app\\domains\\media\\domain\\valueobjects\\subtractfromtotalsize',
        13 => 'app\\domains\\media\\domain\\valueobjects\\incrementaccesscount',
        14 => 'app\\domains\\media\\domain\\valueobjects\\setmediacount',
        15 => 'app\\domains\\media\\domain\\valueobjects\\setsubfoldercount',
        16 => 'app\\domains\\media\\domain\\valueobjects\\settotalsize',
        17 => 'app\\domains\\media\\domain\\valueobjects\\gettotalitems',
        18 => 'app\\domains\\media\\domain\\valueobjects\\gettotalsizeinmb',
        19 => 'app\\domains\\media\\domain\\valueobjects\\gettotalsizeingb',
        20 => 'app\\domains\\media\\domain\\valueobjects\\getformattedtotalsize',
        21 => 'app\\domains\\media\\domain\\valueobjects\\getaveragefilesize',
        22 => 'app\\domains\\media\\domain\\valueobjects\\getformattedaveragefilesize',
        23 => 'app\\domains\\media\\domain\\valueobjects\\isempty',
        24 => 'app\\domains\\media\\domain\\valueobjects\\hasmedia',
        25 => 'app\\domains\\media\\domain\\valueobjects\\hassubfolders',
        26 => 'app\\domains\\media\\domain\\valueobjects\\hasbeenaccessed',
        27 => 'app\\domains\\media\\domain\\valueobjects\\getlastaccessedformatted',
        28 => 'app\\domains\\media\\domain\\valueobjects\\getlastaccessedrelative',
        29 => 'app\\domains\\media\\domain\\valueobjects\\getdensity',
        30 => 'app\\domains\\media\\domain\\valueobjects\\getutilizationpercentage',
        31 => 'app\\domains\\media\\domain\\valueobjects\\toarray',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Domain/ValueObjects/MediaType.php' => 
    array (
      0 => 'f85a17bedbaafa73ebf04a273d27a8de70f8a283',
      1 => 
      array (
        0 => 'app\\domains\\media\\domain\\valueobjects\\mediatype',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\domain\\valueobjects\\__construct',
        1 => 'app\\domains\\media\\domain\\valueobjects\\image',
        2 => 'app\\domains\\media\\domain\\valueobjects\\video',
        3 => 'app\\domains\\media\\domain\\valueobjects\\audio',
        4 => 'app\\domains\\media\\domain\\valueobjects\\document',
        5 => 'app\\domains\\media\\domain\\valueobjects\\archive',
        6 => 'app\\domains\\media\\domain\\valueobjects\\other',
        7 => 'app\\domains\\media\\domain\\valueobjects\\getvalue',
        8 => 'app\\domains\\media\\domain\\valueobjects\\isimage',
        9 => 'app\\domains\\media\\domain\\valueobjects\\isvideo',
        10 => 'app\\domains\\media\\domain\\valueobjects\\isaudio',
        11 => 'app\\domains\\media\\domain\\valueobjects\\isdocument',
        12 => 'app\\domains\\media\\domain\\valueobjects\\isarchive',
        13 => 'app\\domains\\media\\domain\\valueobjects\\isother',
        14 => 'app\\domains\\media\\domain\\valueobjects\\isvisual',
        15 => 'app\\domains\\media\\domain\\valueobjects\\isaudiovisual',
        16 => 'app\\domains\\media\\domain\\valueobjects\\supportsthumbnail',
        17 => 'app\\domains\\media\\domain\\valueobjects\\supportsdimensions',
        18 => 'app\\domains\\media\\domain\\valueobjects\\supportsduration',
        19 => 'app\\domains\\media\\domain\\valueobjects\\getmaxfilesize',
        20 => 'app\\domains\\media\\domain\\valueobjects\\getallowedmimetypes',
        21 => 'app\\domains\\media\\domain\\valueobjects\\getdisplayname',
        22 => 'app\\domains\\media\\domain\\valueobjects\\geticon',
        23 => 'app\\domains\\media\\domain\\valueobjects\\getcolor',
        24 => 'app\\domains\\media\\domain\\valueobjects\\equals',
        25 => 'app\\domains\\media\\domain\\valueobjects\\__tostring',
        26 => 'app\\domains\\media\\domain\\valueobjects\\validate',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Domain/ValueObjects/MediaMetrics.php' => 
    array (
      0 => '99e1fbc1621683147db832ec402eb5590c803ebc',
      1 => 
      array (
        0 => 'app\\domains\\media\\domain\\valueobjects\\mediametrics',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\domain\\valueobjects\\__construct',
        1 => 'app\\domains\\media\\domain\\valueobjects\\empty',
        2 => 'app\\domains\\media\\domain\\valueobjects\\getdownloadcount',
        3 => 'app\\domains\\media\\domain\\valueobjects\\getviewcount',
        4 => 'app\\domains\\media\\domain\\valueobjects\\getsharecount',
        5 => 'app\\domains\\media\\domain\\valueobjects\\getwidth',
        6 => 'app\\domains\\media\\domain\\valueobjects\\getheight',
        7 => 'app\\domains\\media\\domain\\valueobjects\\getduration',
        8 => 'app\\domains\\media\\domain\\valueobjects\\getsize',
        9 => 'app\\domains\\media\\domain\\valueobjects\\incrementdownloadcount',
        10 => 'app\\domains\\media\\domain\\valueobjects\\incrementviewcount',
        11 => 'app\\domains\\media\\domain\\valueobjects\\incrementsharecount',
        12 => 'app\\domains\\media\\domain\\valueobjects\\setdimensions',
        13 => 'app\\domains\\media\\domain\\valueobjects\\setduration',
        14 => 'app\\domains\\media\\domain\\valueobjects\\setsize',
        15 => 'app\\domains\\media\\domain\\valueobjects\\getsizeinmb',
        16 => 'app\\domains\\media\\domain\\valueobjects\\getsizeingb',
        17 => 'app\\domains\\media\\domain\\valueobjects\\getformattedsize',
        18 => 'app\\domains\\media\\domain\\valueobjects\\getaspectratio',
        19 => 'app\\domains\\media\\domain\\valueobjects\\getdurationinseconds',
        20 => 'app\\domains\\media\\domain\\valueobjects\\getdurationformatted',
        21 => 'app\\domains\\media\\domain\\valueobjects\\gettotalengagement',
        22 => 'app\\domains\\media\\domain\\valueobjects\\getengagementrate',
        23 => 'app\\domains\\media\\domain\\valueobjects\\hasdimensions',
        24 => 'app\\domains\\media\\domain\\valueobjects\\hasduration',
        25 => 'app\\domains\\media\\domain\\valueobjects\\islandscape',
        26 => 'app\\domains\\media\\domain\\valueobjects\\isportrait',
        27 => 'app\\domains\\media\\domain\\valueobjects\\issquare',
        28 => 'app\\domains\\media\\domain\\valueobjects\\getresolution',
        29 => 'app\\domains\\media\\domain\\valueobjects\\getquality',
        30 => 'app\\domains\\media\\domain\\valueobjects\\toarray',
        31 => 'app\\domains\\media\\domain\\valueobjects\\isempty',
        32 => 'app\\domains\\media\\domain\\valueobjects\\hasactivity',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Domain/ValueObjects/MediaStatus.php' => 
    array (
      0 => '60de0381892a0970592cbd513d39e7904fa8510c',
      1 => 
      array (
        0 => 'app\\domains\\media\\domain\\valueobjects\\mediastatus',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\domain\\valueobjects\\__construct',
        1 => 'app\\domains\\media\\domain\\valueobjects\\uploading',
        2 => 'app\\domains\\media\\domain\\valueobjects\\processing',
        3 => 'app\\domains\\media\\domain\\valueobjects\\ready',
        4 => 'app\\domains\\media\\domain\\valueobjects\\failed',
        5 => 'app\\domains\\media\\domain\\valueobjects\\deleted',
        6 => 'app\\domains\\media\\domain\\valueobjects\\getvalue',
        7 => 'app\\domains\\media\\domain\\valueobjects\\isuploading',
        8 => 'app\\domains\\media\\domain\\valueobjects\\isprocessing',
        9 => 'app\\domains\\media\\domain\\valueobjects\\isready',
        10 => 'app\\domains\\media\\domain\\valueobjects\\isfailed',
        11 => 'app\\domains\\media\\domain\\valueobjects\\isdeleted',
        12 => 'app\\domains\\media\\domain\\valueobjects\\canbeprocessed',
        13 => 'app\\domains\\media\\domain\\valueobjects\\canbemarkedasready',
        14 => 'app\\domains\\media\\domain\\valueobjects\\canbemarkedasfailed',
        15 => 'app\\domains\\media\\domain\\valueobjects\\canbedownloaded',
        16 => 'app\\domains\\media\\domain\\valueobjects\\canbeviewed',
        17 => 'app\\domains\\media\\domain\\valueobjects\\canbeedited',
        18 => 'app\\domains\\media\\domain\\valueobjects\\canbedeleted',
        19 => 'app\\domains\\media\\domain\\valueobjects\\getdisplayname',
        20 => 'app\\domains\\media\\domain\\valueobjects\\getcolor',
        21 => 'app\\domains\\media\\domain\\valueobjects\\geticon',
        22 => 'app\\domains\\media\\domain\\valueobjects\\equals',
        23 => 'app\\domains\\media\\domain\\valueobjects\\__tostring',
        24 => 'app\\domains\\media\\domain\\valueobjects\\validate',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Observers/FolderObserver.php' => 
    array (
      0 => '3cdf5635eb88e5f53546447eb841aaf958d50f76',
      1 => 
      array (
        0 => 'app\\domains\\media\\observers\\folderobserver',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\observers\\created',
        1 => 'app\\domains\\media\\observers\\updated',
        2 => 'app\\domains\\media\\observers\\deleted',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Observers/MediaObserver.php' => 
    array (
      0 => '9a93f9410f7a4598c7b7fac30f47c68ce1196047',
      1 => 
      array (
        0 => 'app\\domains\\media\\observers\\mediaobserver',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\observers\\created',
        1 => 'app\\domains\\media\\observers\\updated',
        2 => 'app\\domains\\media\\observers\\deleted',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Services/MediaService.php' => 
    array (
      0 => '055acd268d4d1be870b3e7f8c2b58d731a3f48eb',
      1 => 
      array (
        0 => 'app\\domains\\media\\services\\mediaservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\services\\__construct',
        1 => 'app\\domains\\media\\services\\createmedia',
        2 => 'app\\domains\\media\\services\\getmediabyid',
        3 => 'app\\domains\\media\\services\\updatemedia',
        4 => 'app\\domains\\media\\services\\deletemedia',
        5 => 'app\\domains\\media\\services\\getallmedia',
        6 => 'app\\domains\\media\\services\\getmediabyfolder',
        7 => 'app\\domains\\media\\services\\createfolder',
        8 => 'app\\domains\\media\\services\\getfolderbyid',
        9 => 'app\\domains\\media\\services\\updatefolder',
        10 => 'app\\domains\\media\\services\\deletefolder',
        11 => 'app\\domains\\media\\services\\getallfolders',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Services/FolderService.php' => 
    array (
      0 => '8d250bb8900cc141933320c3c737b914fed7ccdd',
      1 => 
      array (
        0 => 'app\\domains\\media\\services\\folderservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\services\\create',
        1 => 'app\\domains\\media\\services\\update',
        2 => 'app\\domains\\media\\services\\ismovingintoselfordescendant',
        3 => 'app\\domains\\media\\services\\delete',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Services/MediaOptimizationService.php' => 
    array (
      0 => '6f537190965d077c7b7d2f21956c865776643849',
      1 => 
      array (
        0 => 'app\\domains\\media\\services\\mediaoptimizationservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\services\\optimizeimage',
        1 => 'app\\domains\\media\\services\\integratecdn',
        2 => 'app\\domains\\media\\services\\optimizevideo',
        3 => 'app\\domains\\media\\services\\optimizeaudio',
      ),
      3 => 
      array (
      ),
    ),
    '/root/projetos/xWin_Dash/Backend/app/Domains/Media/Services/MediaAIService.php' => 
    array (
      0 => 'd7633aea7dc1975e721be9b2bdee13e7a833ef46',
      1 => 
      array (
        0 => 'app\\domains\\media\\services\\mediaaiservice',
      ),
      2 => 
      array (
        0 => 'app\\domains\\media\\services\\__construct',
        1 => 'app\\domains\\media\\services\\generateaitags',
        2 => 'app\\domains\\media\\services\\generateaidescription',
        3 => 'app\\domains\\media\\services\\detectobjects',
        4 => 'app\\domains\\media\\services\\recognizefaces',
        5 => 'app\\domains\\media\\services\\extracttext',
        6 => 'app\\domains\\media\\services\\categorizemedia',
      ),
      3 => 
      array (
      ),
    ),
  ),
));