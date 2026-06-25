import {
  PlayerProgressState,
  ReconstructPlayerProgressInput,
} from '../types/player-progress.types';

export class PlayerProgress {
  private constructor(private props: PlayerProgressState) {}

  // ---------- factory ----------

  static create(userId: number): PlayerProgress {
    return new PlayerProgress({
      id: undefined,
      userId,
    });
  }

  static reconstruct(input: ReconstructPlayerProgressInput) {
    return new PlayerProgress(input);
  }

  // ---------- domain logic ----------

  // ---------- guards ----------

  // ---------- state queries ----------

  // ---------- state mutation ----------

  // ---------- getters ---------

  public get id(): PlayerProgressState['id'] {
    return this.props.id;
  }

  public get userId(): PlayerProgressState['userId'] {
    return this.props.userId;
  }
}
