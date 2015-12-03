import MpdHelper from './MPDHelper.js'
import SpecHelper from './SpecHelper.js'
import Representation from '../../src/dash/vo/Representation.js'

class VoHelper {
    constructor() {
        this.mpdHelper = new MpdHelper();
        this.specHelper = new SpecHelper();
        this.voRep;
        this.voAdaptation;
        this.unixTime = this.specHelper.getUnixTime();
        this.adaptation;
        this.defaultMpdType = "static";
    }

    createMpd(type) {
        var mpd = {};

        mpd.manifest = this.mpdHelper.getMpd(type || this.defaultMpdType);
        mpd.suggestedPresentationDelay = 0;
        mpd.availabilityStartTime = this.unixTime;
        mpd.availabilityEndTime = Number.POSITIVE_INFINITY;
        mpd.timeShiftBufferDepth = 50;
        mpd.maxSegmentDuration = 1;
        mpd.checkTime = 10;

        return mpd;
    }

    createPeriod() {
        var period = {};

        period.mpd = this.createMpd();
        period.start = 0;

        period.id = "id1";
        period.index = 0;
        period.duration = 100;
        period.liveEdge = 50;
        period.isClientServerTimeSyncCompleted = false;
        period.clientServerTimeShift = 0;

        return period;
    }

    createAdaptation(type) {
        var adaptation = {};
        adaptation.period = this.createPeriod();
        adaptation.index = 0;
        adaptation.type = type;

        return adaptation;
    }

    createRepresentation(type) {
        var rep = new Representation(),
            data = this.adaptation || this.mpdHelper.getAdaptationWithSegmentTemplate(type);

        rep.id = null;
        rep.index = 0;
        rep.adaptation = this.createAdaptation(type);
        rep.fragmentInfoType = null;
        rep.initialization = "http://dash.edgesuite.net/envivio/dashpr/clear/video4/Header.m4s";
        rep.segmentDuration = 1;
        rep.timescale = 1;
        rep.startNumber = 1;
        rep.indexRange = null;
        rep.range = null;
        rep.presentationTimeOffset = 10;
        // Set the source buffer timeOffset to this
        rep.MSETimeOffset = NaN;
        rep.segmentAvailabilityRange = null;
        rep.availableSegmentsNumber = 0;

        return rep;
    }

    createRequest(type) {
        var req = {};
        req.action = "download";
        req.quality = 0;
        req.mediaType = "video";
        req.type = type;
        req.url = "http://dash.edgesuite.net/envivio/dashpr/clear/video4/Header.m4s";
        req.startTime = NaN;
        req.duration = NaN;

        if (type === "Media Segment") {
            req.url = "http://dash.edgesuite.net/envivio/dashpr/clear/video4/0.m4s";
            req.startTime = 0;
            req.duration = 4;
            req.index = 0;
        } else if (type === "complete") {
            req.action = type;
            req.url = undefined;
            req.quality = NaN;
        }

        return req;
    }

    getDummyRepresentation(type) {
        return this.voRep || this.createRepresentation(type);
    }

    getDummyMpd(type) {
        return this.createMpd(type);
    }

    getDummyPeriod() {
        return this.createPeriod();
    }

    getMediaRequest() {
        return this.createRequest("Media Segment");
    }

    getInitRequest() {
        return this.createRequest("Initialization Segment");
    }

    getCompleteRequest() {
        return this.createRequest("complete");
    }

    getDummyMediaInfo(type) {
        return {
            type: type,
            bitrateList: [1000, 2000, 3000],
            representationCount: 3
        }
    }
}

export default VoHelper;