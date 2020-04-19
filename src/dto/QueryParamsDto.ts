import {IsBoolean} from 'class-validator';

class QueryParamsDto {
    @IsBoolean()
    public isAlive: boolean;
}

export default QueryParamsDto;